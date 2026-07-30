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

        if bcrypt.checkpw(
            customer_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        ):
            return jsonify({
                "message": "Login Successful"
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
if __name__ == "__main__":
    app.run(debug=True)