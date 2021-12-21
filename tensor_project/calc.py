from flask import Flask, request, session
from flask.templating import render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import hashlib
from sqlalchemy import text
  
app = Flask(__name__, template_folder="app/templates", static_folder="app/static/")
app.config.from_object(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql+psycopg2://postgres:7105@localhost/tensor'
app.config['SECRET_KEY'] = 'cb02820a3e94d72c9f950ee10ef7e3f7a35b3f5b'
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__='users' 
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String)
    password = db.Column(db.String)
    table_apartment = db.Column(db.Integer)

    def __init__(self, login, password):
        self.login=login
        self.password=password

class Materials(db.Model):
    __tablename__='materials' 
    id = db.Column(db.Integer, primary_key=True)
    name_material = db.Column(db.String)
    units_measurement = db.Column(db.String)
    surfaces = db.Column(db.String(3))
    auto = db.Column(db.Integer)

    def __init__(self, square_walls, square_floor_ceiling):
        self.square_walls=square_walls
        self.square_floor_ceiling=square_floor_ceiling

def get_materials():
    sql = text("SELECT id, name_material, units_measurement  FROM materials Where surfaces % 10 = 1 and auto = '0' ORDER BY name_material")
    db_materials_floor = db.session.execute(sql).all()

    sql = text("SELECT id, name_material, units_measurement FROM materials Where surfaces / 10 % 10 = 1 and auto = '0' ORDER BY name_material")
    db_materials_walls = db.session.execute(sql).all()

    sql = text("SELECT id, name_material, units_measurement FROM materials Where surfaces / 100 = 1 and auto = '0' ORDER BY name_material")
    db_materials_ceiling = db.session.execute(sql).all()

    return db_materials_floor, db_materials_walls, db_materials_ceiling

CORS(app)
@app.route('/', methods=['POST', 'GET'])
@app.route('/mainPage')
def main():
    return render_template('mainPage.html')

@app.route('/counterPage', methods=['POST', 'GET'])
def index(): 
    db_materials = get_materials()
    return render_template('counterPage.html', option_floor=db_materials[0], option_walls=db_materials[1], option_ceiling=db_materials[2])

@app.route('/authorization')
def auth():
    return render_template('authorization.html')

@app.route('/authorization/submit', methods=['POST', 'GET'])
def auth_sub():
    username = request.form.get('check_login')
    password = request.form.get('check_pass')
    message = ""
    users_bd = db.session.query(User)
    
    for res in users_bd:
        if username == res.login:
            check_password_bd = res.password
            new_key = hashlib.md5(password.encode()).hexdigest()
            if(new_key  == check_password_bd): 
                session['result_authorization'] = 1
                session['user'] = username
                session.modified = True
                message = "Авторизация прошла успешно"
                if(session['url'] == "/account"):
                    session['url'] = ""
                    return render_template('account.html')
            else: 
                session['result_authorization'] = 0
                session.modified = True
                message = "Неверный логин или пароль"

    return render_template('authorization.html', message=message)

@app.route('/registration')
def reg():
    return render_template('registration.html')

@app.route('/registration/submit', methods=['POST', 'GET'])
def reg_sub():
    message = ''
    username = request.form.get('check_login')
    password = request.form.get('check_pass')
    if(username is None and password is  None):
        message = 'Введите данные'
    else:
        hash_object = hashlib.md5(password.encode()).hexdigest()
        try: 
            user = User(login=username, password=hash_object)
            db.session.add(user)
            db.session.commit()
 
        except Exception:
            message="Такой пользователь уже существует"
        else:
            message = "Пользователь зарегистрирован"
    return render_template('registration.html', message=message)

@app.route('/account')
def account():
    if('result_authorization' in session and session['result_authorization'] == 1):
        return render_template('account.html') 
    else:
        message="Авторизуйтесь для входа в личный кабинет"
        session['url'] = request.path
        return render_template('authorization.html', message=message)


@app.route('/exit')
def exit():
    session['result_authorization'] = 0
    session['user'] = ''
    return render_template('counterPage.html')

if __name__ == '__main__':
    app.run(debug=True)

  