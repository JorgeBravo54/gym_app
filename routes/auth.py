from flask import Blueprint, request, redirect, url_for, flash, session
from models.users import create_user, get_user
import bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"], endpoint="register")
def register():
    username = request.form.get("username")
    password = request.form.get("password")
    repeat_password = request.form.get("repeat_password")

    if password != repeat_password:
        flash("⚠️ Passwords do not match", "error")
        return redirect(url_for("main.index"))

    if get_user(username):
        flash("⚠️ Username already taken", "error")
        return redirect(url_for("main.index"))

    create_user(username, password)
    session["username"] = username
    flash("✅ User registered successfully")
    return redirect(url_for("profile.profile", username=username))

@auth_bp.route("/login", methods=["POST"], endpoint="login")
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    user = get_user(username)
    if not user:
        flash("⚠️ User or password incorrect")
        return redirect(url_for("main.index"))

    if bcrypt.checkpw(password.encode("utf-8"), user[2]):
        session["username"] = username
        flash("✅ Log in successfully")
        return redirect(url_for("profile.profile", username=username))
    else:
        flash("⚠️ User or password incorrect")
        return redirect(url_for("index"))

@auth_bp.route("/logout", methods=["POST"], endpoint="logout")
def logout():
    session.clear()
    return redirect(url_for("main.index"))

