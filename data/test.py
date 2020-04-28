from flask import Flask, render_template

# Import our pymongo library, which lets us connect our Flask app to our Mongo database.
import pymongo

# Create an instance of our Flask app.
app = Flask(__name__)

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
db = client.income_db
medincomes = "test"
# Set route
@app.route("/")
def echo():
    # Store the entire collection in a list
    # medincomes = list(db.income_dict.find())
    # print(medincomes)

    # Return the template with the teams list passed in
    return render_template("index.html", medincomes=medincomes)


if __name__ == "__main__":
    app.run(debug=True)