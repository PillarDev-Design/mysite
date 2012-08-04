#==============================================================#
# app.py                                                       #
#==============================================================#
import flask, datetime, json, re

app = flask.Flask(__name__)

PORT = 8001

#==============================================================#
# Static Endpoints                                             #
#==============================================================#
# Base Render func, everything gets passed through here
def render_skeleton(template_name='index.html', **kwargs):
    return flask.render_template(template_name, **kwargs)

@app.route('/')
def index():
    return flask.render_template('index.html')

#==============================================================#
# Run Server                                                   #
#==============================================================#
if __name__ == "__main__":
    app.debug == True
    app.run(port=8001)
