import os
from flask import Flask,request,jsonify
from flask_cors import CORS
from db import get_connection
import bcrypt
from decimal import Decimal
from werkzeug.utils import secure_filename
import razorpay

app = Flask(__name__)
CORS(app)
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, "frontend", "public", "images")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()
    customer_name = data.get("customer_name")
    customer_email = data.get("customer_email")
    customer_password = data.get("customer_password")
    customer_phone = data.get("customer_phone")
    customer_address = data.get("customer_address")

    hashed_password = bcrypt.hashpw(
        customer_password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')
    conn=None
    cursor=None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
        INSERT INTO customers
        (customer_name, email, phone, password, address)
        VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(query, (
            customer_name,
            customer_email,
            customer_phone,
            hashed_password,
            customer_address
        ))

        conn.commit()

        return jsonify({
            "message": "registered successfully"
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    customer_email = data.get("customer_email")
    customer_password = data.get("customer_password")
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT * FROM customers
        WHERE email = %s
        """

        cursor.execute(query, (customer_email,))
        customer = cursor.fetchone()

        if not customer:
            return jsonify({
                "message": "user not found!"
            }), 404

        hashed_password = customer["password"]

        if bcrypt.checkpw(customer_password.encode("utf-8"),hashed_password.encode("utf-8")):
            return jsonify({
                "message": "Login Successful",
                "customer_id": customer["customer_id"],
                "customer_name": customer["customer_name"],
                "customer_email": customer["email"]
            })

        return jsonify({
            "message": "Invalid Password"
        }), 401

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/products", methods=["GET"])
def get_products():
    conn = None
    cursor = None
    try:
        conn = get_connection()

        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
    p.product_id,
    p.product_name,
    p.description,
    p.price,
    p.stock,
    p.product_status,
    p.image,
    c.category_name
    FROM products p
    JOIN categories c
    ON p.category_id = c.category_id WHERE p.product_status='Available';
        """

        cursor.execute(query)

        products = cursor.fetchall()

        return jsonify(products)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            p.product_id,
            p.product_name,
            p.description,
            p.price,
            p.stock,
            p.product_status,
            p.image,
            c.category_name
        FROM products p
        JOIN categories c
        ON p.category_id = c.category_id
        WHERE p.product_id = %s
        """

        cursor.execute(query, (product_id,))

        product = cursor.fetchone()

        if product:
            return jsonify(product)

        return jsonify({
            "message": "Product not found"
        }), 404

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/categories", methods=["GET"])
def get_categories():

    cursor = None
    conn = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT category_id, category_name
            FROM categories
            ORDER BY category_name
        """)

        categories = cursor.fetchall()

        return jsonify(categories)

    except Exception as e:

        return jsonify({"error": str(e)}), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/add-to-cart", methods=["POST"])
def add_to_cart():

    data = request.get_json()

    customer_id = data.get("customer_id")
    product_id = data.get("product_id")
    requested_quantity = data.get("quantity", 1)

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check whether product already exists in cart
        query = """
        SELECT *
        FROM cart
        WHERE customer_id = %s
        AND product_id = %s
        """

        cursor.execute(query, (customer_id, product_id))

        cart_item = cursor.fetchone()

        message = "Item added to cart successfully."

        if cart_item:

            update_query = """
            UPDATE cart
            SET quantity = quantity + %s
            WHERE customer_id = %s
            AND product_id = %s
            """

            cursor.execute(update_query, (requested_quantity, customer_id, product_id))
            message = "Item is already in your cart. Quantity increased."

        else:

            insert_query = """
            INSERT INTO cart
            (customer_id, product_id, quantity)
            VALUES (%s, %s, %s)
            """

            cursor.execute(insert_query, (customer_id, product_id, requested_quantity))

        conn.commit()

        return jsonify({
            "message": message
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/cart/<int:customer_id>", methods=["GET"])
def get_cart(customer_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            c.cart_id,
            c.quantity,
            p.product_id,
            p.product_name,
            p.price,
            p.image,
            p.product_status
        FROM cart c
        JOIN products p
        ON c.product_id = p.product_id
        WHERE c.customer_id = %s;
        """

        cursor.execute(query, (customer_id,))

        cart_items = cursor.fetchall()

        return jsonify(cart_items)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/remove-cart-item/<int:cart_id>", methods=["DELETE"])
def remove_cart_item(cart_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
        DELETE FROM cart
        WHERE cart_id = %s
        """

        cursor.execute(query, (cart_id,))

        conn.commit()

        return jsonify({
            "message": "Item removed successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/update-cart", methods=["PUT"])
def update_cart():

    data = request.get_json()

    cart_id = data.get("cart_id")
    action = data.get("action")

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT quantity FROM cart WHERE cart_id=%s",
            (cart_id,)
        )

        cart = cursor.fetchone()

        if not cart:
            return jsonify({"message": "Cart item not found"}), 404

        quantity = cart["quantity"]

        if action == "increase":

            cursor.execute(
                """
                UPDATE cart
                SET quantity = quantity + 1
                WHERE cart_id=%s
                """,
                (cart_id,)
            )

        elif action == "decrease":

            if quantity > 1:

                cursor.execute(
                    """
                    UPDATE cart
                    SET quantity = quantity - 1
                    WHERE cart_id=%s
                    """,
                    (cart_id,)
                )

            else:

                cursor.execute(
                    """
                    DELETE FROM cart
                    WHERE cart_id=%s
                    """,
                    (cart_id,)
                )

        conn.commit()

        return jsonify({
            "message": "Cart updated successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/add-to-wishlist", methods=["POST"])
def add_to_wishlist():

    data = request.get_json()

    customer_id = data.get("customer_id")
    product_id = data.get("product_id")

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        check_query = """
        SELECT *
        FROM wishlist
        WHERE customer_id = %s
        AND product_id = %s
        """

        cursor.execute(check_query, (customer_id, product_id))

        wishlist_item = cursor.fetchone()

        if wishlist_item:

            return jsonify({
                "message": "Product already exists in wishlist"
            }), 409

        insert_query = """
        INSERT INTO wishlist
        (customer_id, product_id)
        VALUES (%s, %s)
        """

        cursor.execute(insert_query, (customer_id, product_id))

        conn.commit()

        return jsonify({
            "message": "Product added to wishlist"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/wishlist/<int:customer_id>", methods=["GET"])
def get_wishlist(customer_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            w.wishlist_id,
            p.product_id,
            p.product_name,
            p.price,
            p.image
        FROM wishlist w
        JOIN products p
        ON w.product_id = p.product_id
        WHERE w.customer_id = %s
        """

        cursor.execute(query, (customer_id,))

        wishlist = cursor.fetchall()

        return jsonify(wishlist)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/remove-wishlist/<int:wishlist_id>", methods=["DELETE"])
def remove_wishlist_item(wishlist_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
        DELETE FROM wishlist
        WHERE wishlist_id = %s
        """

        cursor.execute(query, (wishlist_id,))

        conn.commit()

        return jsonify({
            "message": "Product removed from wishlist"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/move-to-cart", methods=["POST"])
def move_to_cart():

    data = request.get_json()

    customer_id = data.get("customer_id")
    product_id = data.get("product_id")

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if product already exists in cart
        cursor.execute(
            """
            SELECT *
            FROM cart
            WHERE customer_id=%s
            AND product_id=%s
            """,
            (customer_id, product_id)
        )

        cart_item = cursor.fetchone()

        if cart_item:

            cursor.execute(
                """
                UPDATE cart
                SET quantity = quantity + 1
                WHERE customer_id=%s
                AND product_id=%s
                """,
                (customer_id, product_id)
            )

        else:

            cursor.execute(
                """
                INSERT INTO cart
                (customer_id, product_id, quantity)
                VALUES (%s,%s,1)
                """,
                (customer_id, product_id)
            )

        # Remove from wishlist
        cursor.execute(
            """
            DELETE FROM wishlist
            WHERE customer_id=%s
            AND product_id=%s
            """,
            (customer_id, product_id)
        )

        conn.commit()

        return jsonify({
            "message": "Product moved to cart"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }),500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/checkout/<int:customer_id>", methods=["GET"])
def checkout(customer_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Customer Details
        customer_query = """
        SELECT
            customer_name,
            address
        FROM customers
        WHERE customer_id = %s
        """

        cursor.execute(customer_query, (customer_id,))
        customer = cursor.fetchone()

        # Cart Items
        cart_query = """
        SELECT
            p.product_name,
            p.image,
            p.price,
            c.quantity
        FROM cart c
        JOIN products p
        ON c.product_id = p.product_id
        WHERE c.customer_id = %s
        """

        cursor.execute(cart_query, (customer_id,))
        items = cursor.fetchall()

        subtotal = Decimal("0.00")

        for item in items:
            subtotal += item["price"] * item["quantity"]

        shipping_fee = Decimal("50.00") if subtotal > 0 else Decimal("0.00")

        tax = subtotal * Decimal("0.18")

        grand_total = subtotal + shipping_fee + tax

        return jsonify({
        "customer": customer,
        "items": items,
        "subtotal": float(subtotal),
        "shipping_fee": float(shipping_fee),
        "tax": float(tax),
        "grand_total": float(grand_total)
    })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/place-order", methods=["POST"])
def place_order():

    data = request.get_json()

    customer_id = data.get("customer_id")
    shipping_address = data.get("shipping_address")

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # ==========================
        # Get Cart Items
        # ==========================

        cart_query = """
        SELECT
            c.product_id,
            c.quantity,
            p.price
        FROM cart c
        JOIN products p
        ON c.product_id = p.product_id
        WHERE c.customer_id = %s
        """

        cursor.execute(cart_query, (customer_id,))
        cart_items = cursor.fetchall()

        if not cart_items:

            return jsonify({
                "message": "Cart is empty"
            }), 400

        # ==========================
        # Calculate Total
        # ==========================

        subtotal = 0

        for item in cart_items:
            subtotal += item["price"] * item["quantity"]

        shipping_fee = 50 if subtotal > 0 else 0

        tax = subtotal * 0.18

        total_amount = subtotal + shipping_fee + tax

        # ==========================
        # Create Order
        # ==========================

        order_query = """
        INSERT INTO orders
        (
            customer_id,
            total_amount,
            shipping_address
        )
        VALUES
        (
            %s,
            %s,
            %s
        )
        """

        cursor.execute(
            order_query,
            (
                customer_id,
                total_amount,
                shipping_address
            )
        )

        order_id = cursor.lastrowid

        # ==========================
        # Insert Order Items
        # ==========================

        order_item_query = """
        INSERT INTO order_items
        (
            order_id,
            product_id,
            quantity,
            price
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s
        )
        """

        for item in cart_items:

            cursor.execute(
                order_item_query,
                (
                    order_id,
                    item["product_id"],
                    item["quantity"],
                    item["price"]
                )
            )

        # ==========================
        # Clear Cart
        # ==========================

        delete_query = """
        DELETE FROM cart
        WHERE customer_id = %s
        """

        cursor.execute(delete_query, (customer_id,))

        conn.commit()

        return jsonify({
            "message": "Order Placed Successfully",
            "order_id": order_id
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/orders/<int:customer_id>", methods=["GET"])
def get_orders(customer_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            order_id,
            total_amount,
            shipping_address,
            order_status,
            order_date
        FROM orders
        WHERE customer_id = %s
        ORDER BY order_date DESC
        """

        cursor.execute(query, (customer_id,))

        orders = cursor.fetchall()

        return jsonify(orders)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route("/order-details/<int:order_id>", methods=["GET"])
def order_details(order_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            oi.order_item_id,
            p.product_name,
            p.image,
            oi.quantity,
            oi.price,
            o.order_status,
            o.shipping_address,
            o.order_date,
            o.total_amount
        FROM order_items oi
        JOIN products p
        ON oi.product_id = p.product_id
        JOIN orders o
        ON oi.order_id = o.order_id
        WHERE oi.order_id = %s
        """

        cursor.execute(query, (order_id,))

        order = cursor.fetchall()

        return jsonify(order)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/admin-register", methods=["POST"])
def admin_register():

    data = request.get_json()

    admin_name = data.get("admin_name")
    admin_email = data.get("admin_email")
    admin_password = data.get("admin_password")

    hashed_password = bcrypt.hashpw(
        admin_password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
        INSERT INTO admin
        (
            admin_name,
            email,
            password
        )
        VALUES
        (
            %s,
            %s,
            %s
        )
        """

        cursor.execute(
            query,
            (
                admin_name,
                admin_email,
                hashed_password
            )
        )

        conn.commit()

        return jsonify({
            "message": "Admin registered successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/admin-login", methods=["POST"])
def admin_login():

    data = request.get_json()

    admin_email = data.get("admin_email")
    admin_password = data.get("admin_password")

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT *
        FROM admin
        WHERE email = %s
        """

        cursor.execute(query, (admin_email,))
        admin = cursor.fetchone()

        if not admin:

            return jsonify({
                "message": "Admin not found"
            }), 404

        if bcrypt.checkpw(
            admin_password.encode("utf-8"),
            admin["password"].encode("utf-8")
        ):

            return jsonify({
                "message": "Admin Login Successful",
                "admin_id": admin["admin_id"],
                "admin_name": admin["admin_name"],
                "admin_email": admin["email"]
            })

        return jsonify({
            "message": "Invalid Password"
        }), 401

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# VENDOR REGISTER
# ==========================================

@app.route("/vendor-register", methods=["POST"])
def vendor_register():

    data = request.get_json()

    vendor_name = data.get("vendor_name")
    shop_name = data.get("shop_name")
    vendor_email = data.get("vendor_email")
    vendor_phone = data.get("vendor_phone")
    vendor_password = data.get("vendor_password")
    vendor_address = data.get("vendor_address")

    # Check required fields
    if not vendor_name or not shop_name or not vendor_email or not vendor_password:
        return jsonify({
            "error": "Vendor name, shop name, email and password are required"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check whether email already exists
        cursor.execute("""
            SELECT vendor_id
            FROM vendors
            WHERE email = %s
        """, (vendor_email,))

        existing_vendor = cursor.fetchone()

        if existing_vendor:
            return jsonify({
                "error": "Vendor with this email already exists"
            }), 409

        # Hash password
        hashed_password = bcrypt.hashpw(
            vendor_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # Insert vendor
        cursor.execute("""
            INSERT INTO vendors
            (
                vendor_name,
                shop_name,
                email,
                phone,
                password,
                address,
                status
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                'Pending'
            )
        """, (
            vendor_name,
            shop_name,
            vendor_email,
            vendor_phone,
            hashed_password,
            vendor_address
        ))

        conn.commit()

        return jsonify({
            "message": "Vendor registration successful. Waiting for admin approval."
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================
# VENDOR LOGIN
# ==========================================

@app.route("/vendor-login", methods=["POST"])
def vendor_login():

    data = request.get_json()

    vendor_email = data.get("vendor_email")
    vendor_password = data.get("vendor_password")

    if not vendor_email or not vendor_password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM vendors
            WHERE email = %s
        """, (vendor_email,))

        vendor = cursor.fetchone()

        if not vendor:
            return jsonify({
                "error": "Vendor not found"
            }), 404

        # Check password
        password_match = bcrypt.checkpw(
            vendor_password.encode("utf-8"),
            vendor["password"].encode("utf-8")
        )

        if not password_match:
            return jsonify({
                "error": "Invalid password"
            }), 401

        # Check vendor status
        if vendor["status"] == "Pending":

            return jsonify({
                "error": "Your vendor account is waiting for admin approval."
            }), 403

        if vendor["status"] == "Rejected":

            return jsonify({
                "error": "Your vendor registration has been rejected."
            }), 403

        if vendor["status"] != "Approved":

            return jsonify({
                "error": "Your vendor account is not active."
            }), 403

        # Successful login
        return jsonify({
            "message": "Vendor Login Successful",
            "vendor_id": vendor["vendor_id"],
            "vendor_name": vendor["vendor_name"],
            "shop_name": vendor["shop_name"],
            "vendor_email": vendor["email"]
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/admin/dashboard", methods=["GET"])
def admin_dashboard():

    conn = None
    cursor = None

    try:
  
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Total Products
        cursor.execute("SELECT COUNT(*) AS total_products FROM products where product_status='Available' ")
        products = cursor.fetchone()["total_products"]

        # Total Categories
        cursor.execute("SELECT COUNT(*) AS total_categories FROM categories")
        categories = cursor.fetchone()["total_categories"]

        # Total Customers
        cursor.execute("SELECT COUNT(*) AS total_customers FROM customers")
        customers = cursor.fetchone()["total_customers"]

        # Total Orders
        cursor.execute("SELECT COUNT(*) AS total_orders FROM orders")
        orders = cursor.fetchone()["total_orders"]

        return jsonify({
            "products": products,
            "categories": categories,
            "customers": customers,
            "orders": orders
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# VENDOR DASHBOARD
# ==========================================

@app.route("/vendor/dashboard/<int:vendor_id>", methods=["GET"])
def vendor_dashboard(vendor_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check vendor
        cursor.execute("""
            SELECT
                vendor_id,
                vendor_name,
                shop_name,
                email,
                status
            FROM vendors
            WHERE vendor_id = %s
        """, (vendor_id,))

        vendor = cursor.fetchone()

        if not vendor:
            return jsonify({
                "error": "Vendor not found"
            }), 404

        if vendor["status"] != "Approved":
            return jsonify({
                "error": "Vendor account is not approved"
            }), 403

        # Count products
        cursor.execute("""
            SELECT COUNT(*) AS product_count
            FROM products
            WHERE vendor_id = %s
        """, (vendor_id,))

        product_result = cursor.fetchone()

        # Count orders containing vendor products
        cursor.execute("""
            SELECT COUNT(DISTINCT oi.order_id) AS order_count
            FROM order_items oi
            INNER JOIN products p
                ON oi.product_id = p.product_id
            WHERE p.vendor_id = %s
        """, (vendor_id,))

        order_result = cursor.fetchone()

            # Calculate sales
            # Calculate sales
        cursor.execute("""
            SELECT
                COALESCE(
                    SUM(oi.price * oi.quantity),
                    0
                ) AS total_sales
            FROM order_items oi
            INNER JOIN products p
                ON oi.product_id = p.product_id
            INNER JOIN orders o
                ON oi.order_id = o.order_id
            WHERE p.vendor_id = %s
            AND o.order_status IN ('Confirmed', 'Delivered')
        """, (vendor_id,))

        sales_result = cursor.fetchone()

        # Recent orders
        cursor.execute("""
            SELECT
                o.order_id,
                o.order_date,
                o.order_status,
                c.customer_name,
                SUM(
                    oi.price * oi.quantity
                ) AS vendor_amount
            FROM orders o

            INNER JOIN customers c
                ON o.customer_id = c.customer_id

            INNER JOIN order_items oi
                ON o.order_id = oi.order_id

            INNER JOIN products p
                ON oi.product_id = p.product_id

            WHERE p.vendor_id = %s

            GROUP BY
                o.order_id,
                o.order_date,
                o.order_status,
                c.customer_name

            ORDER BY o.order_date DESC

            LIMIT 5
        """, (vendor_id,))

        recent_orders = cursor.fetchall()

        return jsonify({

            "vendor": vendor,

            "statistics": {
                "products": product_result["product_count"],
                "orders": order_result["order_count"],
                "sales": float(
                    sales_result["total_sales"]
                )
            },

            "recent_orders": recent_orders

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# VENDOR SALES
# ==========================================
# ==========================================
# VENDOR SALES
# ==========================================

@app.route("/vendor/sales/<int:vendor_id>", methods=["GET"])
def vendor_sales(vendor_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check vendor
        cursor.execute("""
            SELECT vendor_id, status
            FROM vendors
            WHERE vendor_id = %s
        """, (vendor_id,))

        vendor = cursor.fetchone()

        if not vendor:
            return jsonify({
                "error": "Vendor not found"
            }), 404

        if vendor["status"] != "Approved":
            return jsonify({
                "error": "Vendor is not approved"
            }), 403


        # ==========================================
        # SALES SUMMARY
        # ==========================================

        cursor.execute("""
            SELECT

                COALESCE(
                    SUM(
                        CASE
                            WHEN o.order_status IN ('Confirmed', 'Delivered')
                            THEN oi.price * oi.quantity
                            ELSE 0
                        END
                    ),
                    0
                ) AS total_sales,

                COALESCE(
                    SUM(
                        CASE
                            WHEN o.order_status = 'Confirmed'
                            THEN oi.price * oi.quantity
                            ELSE 0
                        END
                    ),
                    0
                ) AS confirmed_sales,

                COALESCE(
                    SUM(
                        CASE
                            WHEN o.order_status = 'Delivered'
                            THEN oi.price * oi.quantity
                            ELSE 0
                        END
                    ),
                    0
                ) AS delivered_sales,

                COALESCE(
                    SUM(
                        CASE
                            WHEN o.order_status = 'Cancelled'
                            THEN oi.price * oi.quantity
                            ELSE 0
                        END
                    ),
                    0
                ) AS cancelled_sales

            FROM order_items oi

            INNER JOIN products p
                ON oi.product_id = p.product_id

            INNER JOIN orders o
                ON oi.order_id = o.order_id

            WHERE p.vendor_id = %s

        """, (vendor_id,))

        summary = cursor.fetchone()


        # ==========================================
        # SALES TRANSACTIONS
        # ==========================================

        cursor.execute("""
            SELECT

                o.order_id,
                o.order_date,
                o.order_status,

                c.customer_name,

                p.product_id,
                p.product_name,

                oi.quantity,
                oi.price,

                (oi.quantity * oi.price) AS amount

            FROM order_items oi

            INNER JOIN products p
                ON oi.product_id = p.product_id

            INNER JOIN orders o
                ON oi.order_id = o.order_id

            INNER JOIN customers c
                ON o.customer_id = c.customer_id

            WHERE p.vendor_id = %s

            ORDER BY o.order_date DESC

        """, (vendor_id,))

        transactions = cursor.fetchall()


        return jsonify({
            "summary": summary,
            "transactions": transactions
        })


    except Exception as e:

        print("Vendor sales error:", e)

        return jsonify({
            "error": str(e)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()
# ==========================================
# VENDOR PROFILE - GET
# ==========================================

@app.route("/vendor/profile/<int:vendor_id>", methods=["GET"])
def get_vendor_profile(vendor_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                vendor_id,
                vendor_name,
                shop_name,
                email,
                phone,
                address,
                status,
                created_at
            FROM vendors
            WHERE vendor_id = %s
        """, (vendor_id,))

        vendor = cursor.fetchone()

        if not vendor:
            return jsonify({
                "error": "Vendor not found"
            }), 404

        return jsonify(vendor), 200

    except Exception as e:

        print("Vendor profile error:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# VENDOR PROFILE - UPDATE
# ==========================================

@app.route("/vendor/profile/<int:vendor_id>", methods=["PUT"])
def update_vendor_profile(vendor_id):

    conn = None
    cursor = None

    try:

        data = request.get_json()

        shop_name = data.get("shop_name")
        phone = data.get("phone")
        address = data.get("address")

        if not shop_name:
            return jsonify({
                "error": "Shop name is required"
            }), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check vendor
        cursor.execute("""
            SELECT vendor_id
            FROM vendors
            WHERE vendor_id = %s
        """, (vendor_id,))

        vendor = cursor.fetchone()

        if not vendor:
            return jsonify({
                "error": "Vendor not found"
            }), 404

        # Update profile
        cursor.execute("""
            UPDATE vendors
            SET
                shop_name = %s,
                phone = %s,
                address = %s
            WHERE vendor_id = %s
        """, (
            shop_name,
            phone,
            address,
            vendor_id
        ))

        conn.commit()

        return jsonify({
            "message": "Profile updated successfully"
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print("Vendor profile update error:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route("/admin/products", methods=["POST"])
def create_product():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        if request.content_type and "multipart/form-data" in request.content_type:
            data = request.form.to_dict()
            image_file = request.files.get("image")
        else:
            data = request.get_json(silent=True) or {}
            image_file = None

        required_fields = [
            "product_name",
            "description",
            "category_id",
            "price",
            "stock"
        ]

        missing = [field for field in required_fields if not data.get(field)]

        if missing:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing)}"
            }), 400

        image_name = None

        if image_file and image_file.filename:
            filename = secure_filename(image_file.filename)
            if not filename:
                return jsonify({
                    "error": "Invalid image filename"
                }), 400

            image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            image_file.save(image_path)
            image_name = filename

        if not image_name:
            image_name = "no-image.jpg"

        query = """
        INSERT INTO products (
            vendor_id,
            category_id,
            product_name,
            description,
            price,
            stock,
            product_status,
            image
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(query, (
            1,
            int(data["category_id"]),
            data["product_name"],
            data["description"],
            float(data["price"]),
            int(data["stock"]),
            data.get("product_status", "Available"),
            image_name
        ))

        conn.commit()

        return jsonify({
            "message": "Product added successfully"
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# VENDOR PRODUCTS
# ==========================================

@app.route("/vendor/products", methods=["POST"])
def vendor_create_product():

    conn = None
    cursor = None

    try:

        # Get form data
        data = request.form

        vendor_id = data.get("vendor_id")
        product_name = data.get("product_name")
        description = data.get("description")
        category_id = data.get("category_id")
        price = data.get("price")
        stock = data.get("stock")

        # Validate
        if not vendor_id:
            return jsonify({
                "error": "Vendor ID is required"
            }), 400

        if not product_name:
            return jsonify({
                "error": "Product name is required"
            }), 400

        if not category_id:
            return jsonify({
                "error": "Category is required"
            }), 400

        if not price:
            return jsonify({
                "error": "Price is required"
            }), 400

        if not stock:
            return jsonify({
                "error": "Stock is required"
            }), 400

        # Image
        image_file = request.files.get("image")
        image_name = None

        if image_file and image_file.filename:

            filename = secure_filename(image_file.filename)

            if not filename:
                return jsonify({
                    "error": "Invalid image filename"
                }), 400

            image_path = os.path.join(
                app.config["UPLOAD_FOLDER"],
                filename
            )

            image_file.save(image_path)

            image_name = filename

        if not image_name:
            image_name = "no-image.jpg"

        # Database
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO products
            (
                vendor_id,
                category_id,
                product_name,
                description,
                price,
                stock,
                product_status,
                image
            )
            VALUES
            (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        product_status = (
            "Available"
            if int(stock) > 0
            else "Out of Stock"
        )

        cursor.execute(
            query,
            (
                vendor_id,
                category_id,
                product_name,
                description,
                price,
                stock,
                product_status,
                image_name
            )
        )

        conn.commit()

        return jsonify({
            "message": "Product added successfully",
            "product_id": cursor.lastrowid
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print("Vendor product error:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route(
    "/vendor/products/<int:vendor_id>",
    methods=["GET"]
)
def vendor_products(vendor_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                p.product_id,
                p.product_name,
                p.description,
                p.price,
                p.stock,
                p.product_status,
                p.image,
                p.created_at,
                c.category_name
            FROM products p

            INNER JOIN categories c
                ON p.category_id = c.category_id

            WHERE p.vendor_id = %s

            ORDER BY p.created_at DESC
        """, (vendor_id,))

        products = cursor.fetchall()

        return jsonify(products)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/admin/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        if request.content_type and "multipart/form-data" in request.content_type:
            data = request.form.to_dict()
            image_file = request.files.get("image")
        else:
            data = request.get_json(silent=True) or {}
            image_file = None

        fields = []
        values = []

        allowed_fields = [
            "product_name",
            "description",
            "category_id",
            "price",
            "stock",
            "product_status"
        ]

        def normalize_value(field, value):
            if value is None:
                return value

            if field in {"category_id", "stock"}:
                return int(value)

            if field == "price":
                return float(value)

            return value

        for field in allowed_fields:
            if field in data and data[field] not in (None, ""):
                fields.append(f"{field} = %s")
                values.append(normalize_value(field, data[field]))

        image_name = None

        if image_file and image_file.filename:
            filename = secure_filename(image_file.filename)
            if not filename:
                return jsonify({
                    "error": "Invalid image filename"
                }), 400

            image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            image_file.save(image_path)
            image_name = filename

        if image_name:
            fields.append("image = %s")
            values.append(image_name)
        elif "existing_image" in data and data["existing_image"]:
            fields.append("image = %s")
            values.append(data["existing_image"])
        elif "image" in data and data["image"]:
            fields.append("image = %s")
            values.append(data["image"])

        if not fields:
            return jsonify({
                "message": "No changes provided"
            }), 400

        values.append(product_id)

        query = f"""
        UPDATE products
        SET {", ".join(fields)}
        WHERE product_id = %s
        """

        cursor.execute(query, tuple(values))

        conn.commit()

        return jsonify({
            "message": "Product updated successfully"
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# VENDOR - UPDATE OWN PRODUCT
# ==========================================

@app.route(
    "/vendor/products/<int:product_id>",
    methods=["PUT"]
)
def update_vendor_product(product_id):

    conn = None
    cursor = None

    try:

        # Get vendor ID from form data
        vendor_id = request.form.get("vendor_id")

        if not vendor_id:
            return jsonify({
                "error": "Vendor ID is required"
            }), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # ==========================================
        # CHECK PRODUCT BELONGS TO THIS VENDOR
        # ==========================================

        cursor.execute("""
            SELECT product_id
            FROM products
            WHERE product_id = %s
            AND vendor_id = %s
        """, (
            product_id,
            vendor_id
        ))

        product = cursor.fetchone()

        if not product:
            return jsonify({
                "error": "You cannot update this product"
            }), 403


        # ==========================================
        # GET FORM DATA
        # ==========================================

        product_name = request.form.get("product_name")
        description = request.form.get("description")
        category_id = request.form.get("category_id")
        price = request.form.get("price")
        stock = request.form.get("stock")
        product_status = request.form.get("product_status")


        # ==========================================
        # VALIDATION
        # ==========================================

        if not product_name:
            return jsonify({
                "error": "Product name is required"
            }), 400

        if not category_id:
            return jsonify({
                "error": "Category is required"
            }), 400

        if price is None or price == "":
            return jsonify({
                "error": "Price is required"
            }), 400

        if stock is None or stock == "":
            return jsonify({
                "error": "Stock is required"
            }), 400


        # ==========================================
        # AUTOMATIC PRODUCT STATUS
        # ==========================================

        if int(stock) > 0:

            if product_status == "Unavailable":
                final_status = "Unavailable"
            else:
                final_status = "Available"

        else:

            final_status = "Out of Stock"


        # ==========================================
        # IMAGE
        # ==========================================

        image_file = request.files.get("image")

        if image_file and image_file.filename:

            filename = secure_filename(
                image_file.filename
            )

            if not filename:
                return jsonify({
                    "error": "Invalid image filename"
                }), 400

            image_path = os.path.join(
                app.config["UPLOAD_FOLDER"],
                filename
            )

            image_file.save(image_path)


            # Update including image

            cursor.execute("""
                UPDATE products
                SET
                    product_name = %s,
                    description = %s,
                    category_id = %s,
                    price = %s,
                    stock = %s,
                    product_status = %s,
                    image = %s
                WHERE product_id = %s
                AND vendor_id = %s
            """, (
                product_name,
                description,
                int(category_id),
                float(price),
                int(stock),
                final_status,
                filename,
                product_id,
                vendor_id
            ))

        else:

            # Update without changing image

            cursor.execute("""
                UPDATE products
                SET
                    product_name = %s,
                    description = %s,
                    category_id = %s,
                    price = %s,
                    stock = %s,
                    product_status = %s
                WHERE product_id = %s
                AND vendor_id = %s
            """, (
                product_name,
                description,
                int(category_id),
                float(price),
                int(stock),
                final_status,
                product_id,
                vendor_id
            ))


        conn.commit()


        return jsonify({
            "message": "Product updated successfully"
        }), 200


    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "Vendor product update error:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# VENDOR - GET OWN ORDERS
# ==========================================
@app.route("/vendor/orders/<int:vendor_id>", methods=["GET"])
def get_vendor_orders(vendor_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check vendor
        cursor.execute("""
            SELECT vendor_id, status
            FROM vendors
            WHERE vendor_id = %s
        """, (vendor_id,))

        vendor = cursor.fetchone()

        if not vendor:
            return jsonify({
                "error": "Vendor not found"
            }), 404

        if vendor["status"] != "Approved":
            return jsonify({
                "error": "Vendor is not approved"
            }), 403

        # Get orders containing this vendor's products
        cursor.execute("""
            SELECT
                o.order_id,
                o.order_date,
                o.order_status,

                c.customer_name,
                c.email,

                oi.order_item_id,
                oi.product_id,
                oi.quantity,
                oi.price,

                p.product_name,
                p.image,

                (oi.quantity * oi.price) AS item_total

            FROM orders o

            INNER JOIN customers c
                ON o.customer_id = c.customer_id

            INNER JOIN order_items oi
                ON o.order_id = oi.order_id

            INNER JOIN products p
                ON oi.product_id = p.product_id

            WHERE p.vendor_id = %s

            ORDER BY o.order_date DESC
        """, (vendor_id,))

        orders = cursor.fetchall()

        return jsonify(orders)

    except Exception as e:

        print("Vendor orders error:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/admin/products/<int:product_id>", methods=["GET"])
def get_admin_product(product_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            product_id,
            vendor_id,
            category_id,
            product_name,
            description,
            price,
            stock,
            product_status,
            image
        FROM products
        WHERE product_id = %s
        """

        cursor.execute(query, (product_id,))

        product = cursor.fetchone()

        if not product:
            return jsonify({
                "message": "Product not found"
            }), 404

        return jsonify(product)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================
# ADMIN - VENDOR DETAILS
# ==========================================

@app.route("/admin/vendors/<int:vendor_id>", methods=["GET"])
def admin_vendor_details(vendor_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # ==========================================
        # VENDOR INFORMATION
        # ==========================================

        cursor.execute("""
            SELECT
                vendor_id,
                vendor_name,
                shop_name,
                email,
                phone,
                address,
                status,
                created_at
            FROM vendors
            WHERE vendor_id = %s
        """, (vendor_id,))

        vendor = cursor.fetchone()

        if not vendor:
            return jsonify({
                "error": "Vendor not found"
            }), 404


        # ==========================================
        # VENDOR PRODUCTS
        # ==========================================

        cursor.execute("""
            SELECT
                p.product_id,
                p.product_name,
                p.description,
                p.price,
                p.stock,
                p.product_status,
                p.image,
                p.category_id,
                c.category_name,
                p.created_at
            FROM products p

            LEFT JOIN categories c
                ON p.category_id = c.category_id

            WHERE p.vendor_id = %s

            ORDER BY p.created_at DESC
        """, (vendor_id,))

        products = cursor.fetchall()


        # ==========================================
        # TOTAL ORDERS
        # ==========================================

        cursor.execute("""
            SELECT
                COUNT(DISTINCT oi.order_id) AS total_orders
            FROM order_items oi

            INNER JOIN products p
                ON oi.product_id = p.product_id

            WHERE p.vendor_id = %s
        """, (vendor_id,))

        order_result = cursor.fetchone()


        # ==========================================
        # TOTAL SALES
        # ==========================================

        cursor.execute("""
            SELECT
                COALESCE(
                    SUM(oi.price * oi.quantity),
                    0
                ) AS total_sales

            FROM order_items oi

            INNER JOIN products p
                ON oi.product_id = p.product_id

            INNER JOIN orders o
                ON oi.order_id = o.order_id

            WHERE p.vendor_id = %s
            AND o.order_status IN (
                'Confirmed',
                'Delivered'
            )
        """, (vendor_id,))

        sales_result = cursor.fetchone()


        # ==========================================
        # RESPONSE
        # ==========================================

        return jsonify({

            "vendor": vendor,

            "statistics": {
                "total_products": len(products),
                "total_orders": order_result["total_orders"],
                "total_sales": float(
                    sales_result["total_sales"] or 0
                )
            },

            "products": products

        }), 200


    except Exception as e:

        print(
            "Admin vendor details error:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# ADMIN - GET ALL ORDERS
# ==========================================

@app.route("/admin/orders", methods=["GET"])
def get_admin_orders():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            o.order_id,
            o.customer_id,
            c.customer_name,
            c.email,
            o.total_amount,
            o.shipping_address,
            o.order_status,
            o.order_date
        FROM orders o
        JOIN customers c
        ON o.customer_id = c.customer_id
        ORDER BY o.order_date DESC
        """

        cursor.execute(query)

        orders = cursor.fetchall()

        return jsonify(orders)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# ADMIN - ORDER DETAILS
# ==========================================

@app.route("/admin/orders/<int:order_id>", methods=["GET"])
def get_admin_order_details(order_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            o.order_id,
            o.customer_id,
            c.customer_name,
            c.email,
            c.phone,
            o.total_amount,
            o.shipping_address,
            o.order_status,
            o.order_date,

            oi.order_item_id,
            oi.product_id,
            oi.quantity,
            oi.price,

            p.product_name,
            p.image

        FROM orders o

        JOIN customers c
        ON o.customer_id = c.customer_id

        JOIN order_items oi
        ON o.order_id = oi.order_id

        JOIN products p
        ON oi.product_id = p.product_id

        WHERE o.order_id = %s
        """

        cursor.execute(query, (order_id,))

        items = cursor.fetchall()

        if not items:

            return jsonify({
                "message": "Order not found"
            }), 404

        return jsonify(items)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# ADMIN - UPDATE ORDER STATUS
# ==========================================

@app.route("/admin/orders/<int:order_id>/status", methods=["PUT"])
def update_order_status(order_id):

    data = request.get_json()

    new_status = data.get("order_status")

    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Delivered",
        "Cancelled"
    ]

    if new_status not in allowed_statuses:

        return jsonify({
            "error": "Invalid order status"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
        UPDATE orders
        SET order_status = %s
        WHERE order_id = %s
        """

        cursor.execute(
            query,
            (
                new_status,
                order_id
            )
        )

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Order not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Order status updated successfully"
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# VENDOR - GET OWN PRODUCTS
# ==========================================

@app.route("/vendor/products/<int:vendor_id>", methods=["GET"])
def get_vendor_products(vendor_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check vendor exists and is approved
        cursor.execute("""
            SELECT vendor_id, status
            FROM vendors
            WHERE vendor_id = %s
        """, (vendor_id,))

        vendor = cursor.fetchone()

        if not vendor:
            return jsonify({
                "error": "Vendor not found"
            }), 404

        if vendor["status"] != "Approved":
            return jsonify({
                "error": "Vendor is not approved"
            }), 403

        # Get only this vendor's products
        cursor.execute("""
            SELECT
                p.product_id,
                p.vendor_id,
                p.category_id,
                p.product_name,
                p.description,
                p.price,
                p.stock,
                p.product_status,
                p.image,
                p.created_at,
                p.updated_at,
                c.category_name
            FROM products p

            INNER JOIN categories c
                ON p.category_id = c.category_id

            WHERE p.vendor_id = %s

            ORDER BY p.created_at DESC
        """, (vendor_id,))

        products = cursor.fetchall()

        return jsonify(products)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# VENDOR - DELETE OWN PRODUCT
# ==========================================

@app.route(
    "/vendor/products/<int:product_id>",
    methods=["DELETE"]
)
def delete_vendor_product(product_id):

    conn = None
    cursor = None

    try:

        data = request.get_json(silent=True) or {}

        vendor_id = data.get("vendor_id")

        if not vendor_id:

            return jsonify({
                "error": "Vendor ID is required"
            }), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check product belongs to vendor
        cursor.execute("""
            SELECT product_id
            FROM products
            WHERE product_id = %s
            AND vendor_id = %s
        """, (
            product_id,
            vendor_id
        ))

        product = cursor.fetchone()

        if not product:

            return jsonify({
                "error": "You cannot delete this product"
            }), 403

        cursor.execute("""
            DELETE FROM products
            WHERE product_id = %s
            AND vendor_id = %s
        """, (
            product_id,
            vendor_id
        ))

        conn.commit()

        return jsonify({
            "message": "Product deleted successfully"
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()
# ==========================================
# ADMIN - GET ALL CUSTOMERS
# ==========================================

@app.route("/admin/customers", methods=["GET"])
def get_admin_customers():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            customer_id,
            customer_name,
            email,
            phone,
            address,
            is_active,
            created_at
        FROM customers
        ORDER BY created_at DESC
        """

        cursor.execute(query)

        customers = cursor.fetchall()

        return jsonify(customers)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()
# ==========================================
# ADMIN - UPDATE CUSTOMER STATUS
# ==========================================

@app.route("/admin/customers/<int:customer_id>/status", methods=["PUT"])
def update_customer_status(customer_id):

    data = request.get_json()

    is_active = data.get("is_active")

    if is_active not in [True, False]:
        return jsonify({
            "error": "Invalid customer status"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
        UPDATE customers
        SET is_active = %s
        WHERE customer_id = %s
        """

        cursor.execute(
            query,
            (
                is_active,
                customer_id
            )
        )

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Customer not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Customer status updated successfully"
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()
@app.route("/admin/categories", methods=["GET"])
def get_admin_categories():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                category_id,
                category_name,
                description
            FROM categories
            ORDER BY category_id ASC
        """)

        categories = cursor.fetchall()

        return jsonify(categories)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()
@app.route("/admin/categories", methods=["POST"])
def add_admin_category():

    data = request.get_json()

    category_name = data.get("category_name")
    description = data.get("description", "")

    if not category_name or not category_name.strip():

        return jsonify({
            "error": "Category name is required"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO categories
            (category_name, description)
            VALUES (%s, %s)
        """, (
            category_name.strip(),
            description
        ))

        conn.commit()

        return jsonify({
            "message": "Category added successfully"
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()
@app.route("/admin/categories/<int:category_id>", methods=["PUT"])
def update_admin_category(category_id):

    data = request.get_json()

    category_name = data.get("category_name")
    description = data.get("description", "")

    if not category_name or not category_name.strip():

        return jsonify({
            "error": "Category name is required"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE categories
            SET category_name = %s,
                description = %s
            WHERE category_id = %s
        """, (
            category_name.strip(),
            description,
            category_id
        ))

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Category not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Category updated successfully"
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/admin/categories/<int:category_id>", methods=["DELETE"])
def delete_admin_category(category_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM categories
            WHERE category_id = %s
        """, (category_id,))

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Category not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Category deleted successfully"
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ==========================================
# ADMIN - GET ALL VENDORS
# ==========================================

@app.route("/admin/vendors", methods=["GET"])
def admin_get_vendors():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                vendor_id,
                vendor_name,
                shop_name,
                email,
                phone,
                address,
                status,
                created_at
            FROM vendors
            ORDER BY created_at DESC
        """)

        vendors = cursor.fetchall()

        return jsonify(vendors)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================
# ADMIN - UPDATE VENDOR STATUS
# ==========================================

@app.route(
    "/admin/vendors/<int:vendor_id>/status",
    methods=["PUT"]
)
def admin_update_vendor_status(vendor_id):

    data = request.get_json()

    new_status = data.get("status")

    allowed_statuses = [
        "Pending",
        "Approved",
        "Rejected"
    ]

    if new_status not in allowed_statuses:

        return jsonify({
            "error": "Invalid vendor status"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check vendor exists
        cursor.execute("""
            SELECT vendor_id
            FROM vendors
            WHERE vendor_id = %s
        """, (vendor_id,))

        vendor = cursor.fetchone()

        if not vendor:

            return jsonify({
                "error": "Vendor not found"
            }), 404

        # Update status
        cursor.execute("""
            UPDATE vendors
            SET status = %s
            WHERE vendor_id = %s
        """, (
            new_status,
            vendor_id
        ))

        conn.commit()

        return jsonify({
            "message": f"Vendor status changed to {new_status}",
            "status": new_status
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/create-razorpay-order", methods=["POST"])
def create_razorpay_order():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        customer_id = data.get("customer_id")

        if not customer_id:
            return jsonify({
                "error": "Customer ID is required"
            }), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT
            p.price,
            c.quantity
        FROM cart c
        JOIN products p
        ON c.product_id = p.product_id
        WHERE c.customer_id = %s
        """

        cursor.execute(query, (customer_id,))

        items = cursor.fetchall()

        if not items:
            return jsonify({
                "error": "Your cart is empty"
            }), 400

        subtotal = sum(
            float(item["price"]) * item["quantity"]
            for item in items
        )

        shipping_fee = 50 if subtotal > 0 else 0

        tax = subtotal * 0.18

        grand_total = subtotal + shipping_fee + tax

        # Razorpay expects paise
        amount_in_paise = int(round(grand_total * 100))

        razorpay_order = razorpay_client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"glowcart_{customer_id}",
            "payment_capture": 1
        })

        return jsonify({

            "key_id": RAZORPAY_KEY_ID,

            "razorpay_order_id":
                razorpay_order["id"],

            "amount": amount_in_paise,

            "currency": "INR",

            "subtotal": subtotal,

            "shipping_fee": shipping_fee,

            "tax": tax,

            "grand_total": grand_total

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()
# ==========================================
# VERIFY RAZORPAY PAYMENT
# ==========================================

@app.route("/verify-payment", methods=["POST"])
def verify_payment():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        customer_id = data.get("customer_id")
        shipping_address = data.get("shipping_address")

        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")

        if not customer_id:
            return jsonify({
                "error": "Customer ID is required"
            }), 400

        if not shipping_address:
            return jsonify({
                "error": "Shipping address is required"
            }), 400

        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return jsonify({
                "error": "Payment details are missing"
            }), 400

        # ------------------------------------------
        # VERIFY RAZORPAY SIGNATURE
        # ------------------------------------------

        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })

        # ------------------------------------------
        # DATABASE CONNECTION
        # ------------------------------------------

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # ------------------------------------------
        # GET CART ITEMS
        # ------------------------------------------

        cursor.execute("""
            SELECT
                c.product_id,
                c.quantity,
                p.price,
                p.stock
            FROM cart c
            JOIN products p
            ON c.product_id = p.product_id
            WHERE c.customer_id = %s
        """, (customer_id,))

        cart_items = cursor.fetchall()

        if not cart_items:

            return jsonify({
                "error": "Cart is empty"
            }), 400

        # ------------------------------------------
        # CALCULATE TOTAL
        # ------------------------------------------

        subtotal = 0

        for item in cart_items:

            if item["quantity"] > item["stock"]:

                return jsonify({
                    "error": "Insufficient stock for one or more products"
                }), 400

            subtotal += (
                float(item["price"]) *
                item["quantity"]
            )

        shipping_fee = 50 if subtotal > 0 else 0

        tax = subtotal * 0.18

        grand_total = subtotal + shipping_fee + tax

        # ------------------------------------------
        # CREATE ORDER
        # ------------------------------------------

        cursor.execute("""
            INSERT INTO orders
            (
                customer_id,
                total_amount,
                shipping_address,
                order_status
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s
            )
        """, (
            customer_id,
            grand_total,
            shipping_address,
            "Confirmed"
        ))

        order_id = cursor.lastrowid

        # ------------------------------------------
        # INSERT ORDER ITEMS
        # ------------------------------------------

        for item in cart_items:

            cursor.execute("""
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    price
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s
                )
            """, (
                order_id,
                item["product_id"],
                item["quantity"],
                item["price"]
            ))

            # Reduce stock

            cursor.execute("""
                UPDATE products
                SET stock = stock - %s
                WHERE product_id = %s
            """, (
                item["quantity"],
                item["product_id"]
            ))

        # ------------------------------------------
        # INSERT PAYMENT
        # ------------------------------------------

        cursor.execute("""
            INSERT INTO payments
            (
                order_id,
                transaction_id,
                payment_method,
                payment_status,
                amount
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s
            )
        """, (
            order_id,
            razorpay_payment_id,
            "UPI",
            "Success",
            grand_total
        ))

        # ------------------------------------------
        # CLEAR CART
        # ------------------------------------------

        cursor.execute("""
            DELETE FROM cart
            WHERE customer_id = %s
        """, (customer_id,))

        conn.commit()

        return jsonify({

            "message": "Payment successful and order placed",

            "order_id": order_id,

            "payment_id": razorpay_payment_id,

            "amount": grand_total

        })

    except razorpay.errors.SignatureVerificationError:

        if conn:
            conn.rollback()

        return jsonify({
            "error": "Payment verification failed"
        }), 400

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

if __name__ == "__main__":
    app.run(debug=True)