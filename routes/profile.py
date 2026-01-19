from flask import Blueprint, render_template, session

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile/<username>", endpoint="profile")
def profile(username):
    current_user = session.get("username") or username
    return render_template("profile.html", username=current_user)

@profile_bp.route("/commentSection", methods=["GET", "POST"], endpoint="comment_section")
def comment_section():
    username = session.get("username")
    return render_template("commentSection.html", username=username)
