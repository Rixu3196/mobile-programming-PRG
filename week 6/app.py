import os
import sqlite3
from flask import Flask, request, redirect, url_for, flash, render_template_string

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev")


def get_connection() -> sqlite3.Connection:
    db_path = os.path.join(os.path.dirname(__file__), "users.db")
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def create_table_if_not_exists() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
            )
            """
        )
        conn.commit()


def insert_user(name: str, email: str) -> tuple[bool, str]:
    try:
        with get_connection() as conn:
            conn.execute(
                "INSERT INTO users (name, email) VALUES (?, ?)",
                (name.strip(), email.strip()),
            )
            conn.commit()
        return True, f"User {name} added successfully!"
    except sqlite3.IntegrityError:
        return False, "Email already exists."


def fetch_users() -> list[tuple[int, str, str]]:
    with get_connection() as conn:
        cursor = conn.execute(
            "SELECT id, name, email FROM users ORDER BY id DESC"
        )
        return cursor.fetchall()


# Initialize database once at startup (Flask 3.x removed before_first_request)
create_table_if_not_exists()


INDEX_HTML = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Users</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; }
    .container { max-width: 720px; margin: 0 auto; }
    form { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; margin-bottom: 16px; }
    input { padding: 8px; font-size: 14px; }
    button { padding: 8px 12px; font-size: 14px; cursor: pointer; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background: #f7f7f7; text-align: left; }
    .flash { padding: 10px 12px; margin-bottom: 12px; border-radius: 4px; }
    .flash.success { background: #e6ffed; color: #1b5e20; border: 1px solid #a5d6a7; }
    .flash.error { background: #ffebee; color: #b71c1c; border: 1px solid #ef9a9a; }
  </style>
  <script>
    // Simple client-side validation to avoid empty submissions
    function validateForm() {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      if (!name || !email) { alert('Name and Email are required.'); return false; }
      return true;
    }
  </script>
  </head>
<body>
  <div class="container">
    <h2>Add User</h2>
    {% with messages = get_flashed_messages(with_categories=true) %}
      {% if messages %}
        {% for category, message in messages %}
          <div class="flash {{ 'success' if category == 'success' else 'error' }}">{{ message }}</div>
        {% endfor %}
      {% endif %}
    {% endwith %}
    <form method="post" action="{{ url_for('index') }}" onsubmit="return validateForm()">
      <input id="name" name="name" type="text" placeholder="Name" />
      <input id="email" name="email" type="email" placeholder="Email" />
      <button type="submit">Add</button>
    </form>

    <h2>All Users</h2>
    <table>
      <thead>
        <tr><th>ID</th><th>Name</th><th>Email</th></tr>
      </thead>
      <tbody>
        {% if users %}
          {% for user in users %}
            <tr>
              <td>{{ user[0] }}</td>
              <td>{{ user[1] }}</td>
              <td>{{ user[2] }}</td>
            </tr>
          {% endfor %}
        {% else %}
          <tr><td colspan="3" style="text-align:center; color:#666;">No users yet</td></tr>
        {% endif %}
      </tbody>
    </table>
  </div>
</body>
</html>
"""


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        name = (request.form.get("name") or "").strip()
        email = (request.form.get("email") or "").strip()
        if not name or not email:
            flash("Name and Email are required.", "error")
        else:
            ok, msg = insert_user(name, email)
            flash(msg, "success" if ok else "error")
        return redirect(url_for("index"))

    users = fetch_users()
    return render_template_string(INDEX_HTML, users=users)


if __name__ == "__main__":
    # Development server
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)