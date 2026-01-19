
from .main import main_bp
from .auth import auth_bp
from .profile import profile_bp
from .comments import comments_bp
from .routines import routines_bp

all_blueprints = [main_bp, auth_bp, profile_bp, comments_bp, routines_bp]
