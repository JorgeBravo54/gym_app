from flask import Blueprint, request, jsonify, session
from models.routines import get_routines, save_routines

routines_bp = Blueprint("routines", __name__)

@routines_bp.route("/routines", methods=["GET", "POST"], endpoint="routines")
def routines():
    username = session.get("username")
    if not username:
        return jsonify({"error": "Not logged in"}), 401

    if request.method == "GET":
        rows = get_routines(username)
        routines = {}
        for rid, func, reps, sets, weight in rows:
            routines.setdefault(rid, []).append({
                "function": func,
                "reps": reps,
                "sets": sets,
                "weight": weight
            })
        return jsonify(routines)

    if request.method == "POST":
        data = request.get_json()
        routines = data.get("routines", {})
        save_routines(username, routines)
        return jsonify({"status": "saved"})

