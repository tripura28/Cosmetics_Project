from flask import Flask,request,jsonify
from flask_cors import CORS
from db import get_connection
import bcrypt
app = Flask(__name__)
CORS(app)
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
ON p.category_id = c.category_id;
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

        if cart_item:

            update_query = """
            UPDATE cart
            SET quantity = quantity + 1
            WHERE customer_id = %s
            AND product_id = %s
            """

            cursor.execute(update_query, (customer_id, product_id))

        else:

            insert_query = """
            INSERT INTO cart
            (customer_id, product_id, quantity)
            VALUES (%s, %s, 1)
            """

            cursor.execute(insert_query, (customer_id, product_id))

        conn.commit()

        return jsonify({
            "message": "Product added to cart"
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
            p.image
        FROM cart c
        JOIN products p
        ON c.product_id = p.product_id
        WHERE c.customer_id = %s
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

        total = 0

        for item in items:
            total += item["price"] * item["quantity"]

        return jsonify({
            "customer": customer,
            "items": items,
            "total": total
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

        total_amount = 0

        for item in cart_items:

            total_amount += item["price"] * item["quantity"]

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


if __name__ == "__main__":
    app.run(debug=True)