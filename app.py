from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/munching_db"
mongo = PyMongo(app)

@app.route("/", methods=['GET'])
def index():
    # Return the template
    return render_template("index.html")

@app.route("/medincome", methods=['GET'])
def medincome():
    data = mongo.db.income_tble.find()
    print(type(data))
    alldata = list(data)
    for State in data:
        alldata.append(State)
    # remove _id
    for State in alldata:
        State.pop("_id")

    return jsonify(alldata)

@app.route("/foodAvail", methods=['GET'])
def foodAvail():
    data = mongo.db.foodtbl.find()
    print(type(data))
    alldata = list(data)
    for Total in data:
        alldata.append(Total)
    # remove _id
    for Total in alldata:
        Total.pop("_id")

    return jsonify(alldata)

@app.route("/foodcons", methods=['GET'])
def foodcons():
    data = mongo.db.ranktble.find()
    print(type(data))
    alldata = list(data)
    for Rank in data:
        alldata.append(Rank)
    # remove _id
    for Rank in alldata:
        Rank.pop("_id")

    return jsonify(alldata)

@app.route("/foodtable", methods=['GET'])
def foodtable():
    data = mongo.db.veggietble.find()
    print(type(data))
    alldata = list(data)
    for Rank in data:
        alldata.append(Rank)
    # remove _id
    for Rank in alldata:
        Rank.pop("_id")

    return jsonify(alldata)

@app.route("/commoditycons", methods=['GET'])
def commoditycons():
    data = mongo.db.cctbl.find()
    print(type(data))
    alldata = list(data)
    for FoodGroup in data:
        alldata.append(FoodGroup)
    # remove _id
    for FoodGroup in alldata:
        FoodGroup.pop("_id")

    return jsonify(alldata)

if __name__ == "__main__":
    app.run(debug=False)