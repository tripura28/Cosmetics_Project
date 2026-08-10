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

@app.route("/admin/dashboard", methods=["GET"])
def admin_dashboard():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Total Products
        cursor.execute("SELECT COUNT(*) AS total_products FROM products")
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