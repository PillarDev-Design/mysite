#==============================================================#
# app.py                                                       #
#==============================================================#
import flask
import datetime
import json
import re
import pymongo

from backend import settings


#==============================================================#
# Setup Flask App                                              #
#==============================================================#
app = flask.Flask(__name__)

#DB Connections(?)
DB_CONNECTION = pymongo.Connection('localhost', 27017)
DB = DB_CONNECTION.mysite

PORT = getattr(settings, 'PORT', 8080)
ENV = getattr(settings, 'ENV', 'develop')

# Redis connection

#==============================================================#
# Static Endpoints                                             #
#==============================================================#
# Base Render func, everything gets passed through here
def render_skeleton(template_name='index.html', **kwargs):
    return flask.render_template(template_name, **kwargs)

@app.route('/')
def index():
    ret = {}
    #==========================================================#
    # Grab Last 5 Notes                                        #
    #==========================================================#
    all_notes = []
    categories = {}
    all_notes, ret['categories'] = get_all_notes_and_categories()
    ret['latest_notes'] = all_notes[0:5]
    return render_skeleton('home.html', **ret)

@app.route('/about/')
def about():
    return render_skeleton('about.html')

#==============================================================#
# Projects                                                     #
#==============================================================#
@app.route('/projects/')
def projects():
    return render_skeleton('projects.html')

@app.route('/us_natality/')
def us_natality():
    return render_skeleton('us_natality.html')

@app.route('/gw2_infographic/')
def gw2_infographic():
    return render_skeleton('gw2_infographic.html')
#==============================================================#
# Notes                                                        #
#==============================================================#
@app.route('/notes/')
@app.route('/notes/<category>/')
@app.route('/notes/<category>/<slug>/')
def notes(category=None, slug=None):
    #==========================================================#
    # Setup Return Dictionary                                  #
    #==========================================================#
    ret = {
        'notes': [],
        'note': False,
        'categories': {}
        }

    template_name = 'notes.html'
    
    #==========================================================#
    # Get Note based on Query                                  #
    #==========================================================#
    # All Notes

    if category is None and slug is None:
        db_notes = DB.notes.find().sort('post_date', -1)
    # Only Category Notes
    elif category is not None and slug is None:
        db_notes = DB.notes.find({'category':category}).sort('post_date', -1)
    # Single Note
    elif category is not None and slug is not None:
        db_notes = DB.notes.find({'slug':slug}).sort('post_date', -1)
        template_name = 'note_single.html'
    #==========================================================#
    # Setup Response                                           #
    #==========================================================#
    for note in db_notes:
        note.pop('_id')
        ret['notes'].append(note)
    
    #==========================================================#
    # For All Pages                                            #
    #==========================================================#
    all_notes = []
    all_notes, ret['categories'] = get_all_notes_and_categories()
    ret['latest_notes'] = all_notes[0:5]
    ret['total_notes'] = len(all_notes)
        
    return render_skeleton(template_name, **ret)

def get_all_notes_and_categories():
    all_db_notes = DB.notes.find().sort('post_date', -1)

    all_notes = []
    categories = {}

    for note in all_db_notes:
        note.pop('_id')
        all_notes.append(note)

        try:
            categories[note['category']]['num'] += 1
        except KeyError:
            categories[note['category']] = {}
            categories[note['category']]['num'] = 1
            categories[note['category']][
                'pretty_name'] = note['category'].replace('_', ' ').capitalize()
    
    return (all_notes, categories)

#==============================================================#
# Run Server                                                   #
#==============================================================#
if __name__ == "__main__":
    if ENV == 'develop':
        app.debug = True
        app.run(port=PORT)
