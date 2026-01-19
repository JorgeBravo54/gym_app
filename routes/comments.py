from flask import Blueprint, request, jsonify, session
from models.comments import get_all_comments, add_comment, update_comment, delete_comment

comments_bp = Blueprint("comments", __name__)

@comments_bp.route("/comments", methods=["GET", "POST"], endpoint="comments")
def comments():
    username = session.get("username")
    if not username:
        return jsonify({"error": "Not logged in"}), 401

    if request.method == "GET":
        rows = get_all_comments()
        return jsonify([{"id": cid, "username": uname, "comment": comment} for cid, uname, comment in rows])

    if request.method == "POST":
        data = request.get_json()
        text = data.get("comment", "").strip()
        if not text:
            return jsonify({"error": "Empty comment"}), 400
        new_id = add_comment(username, text)
        return jsonify({"status": "saved", "id": new_id})

@comments_bp.route("/comments/<int:cid>", methods=["PUT"], endpoint="update_comment")
def update(cid):
    username = session.get("username")
    if not username:
        return jsonify({"error": "Not logged in"}), 401
    data = request.get_json()
    text = data.get("comment", "").strip()
    if not text:
        return jsonify({"error": "Empty comment"}), 400
    update_comment(cid, username, text)
    return jsonify({"status": "updated"})

@comments_bp.route("/comments/<int:cid>", methods=["DELETE"], endpoint="delete_comment")
def delete(cid):
    username = session.get("username")
    if not username:
        return jsonify({"error": "Not logged in"}), 401
    delete_comment(cid, username)
    return jsonify({"status": "deleted"})
