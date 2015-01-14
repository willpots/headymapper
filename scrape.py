from bs4 import BeautifulSoup
import requests
import json

API_KEY = "AIzaSyBCWVqDMCBg_x2yD80SLVJ6-YMrRjxhzUA"
r = requests.get('http://alchemistbeer.com/buy/')


def process(thing):
  if thing.name == "div":
    result = {}
    result["name"] = thing.find(attrs={"class": "name"}).text.strip().title()
    result["address"] = thing.find(attrs={"class": "street"}).text.strip().title() + ", VT"
    result["delivery"] = thing.find(attrs={"class": "delivery"}).text.strip().title()
    if "Cases Available" in result["delivery"]:
      result["delivery"] = result["delivery"].replace("Cases Available","").strip()
      result["cases"] = True
    else:
      result["cases"] = False
    result["hours"] = thing.find(attrs={"class": "hours"}).text.strip().title()
    if thing.img['src'] == "http://alchemistbeer.com/wp-content/themes/alchemist/images/store.png":
      result["type"] = "store"
    if thing.img['src'] == "http://alchemistbeer.com/wp-content/themes/alchemist/images/eatery.png":
      result["type"] = "eatery"
    a = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address="+result["address"].replace(" ","+")+"&key="+API_KEY)
    print result["name"], a.status_code, a.json()["results"][0]
    result["location"] = a.json()["results"][0]
    result["csv"] = "%s|%s|%s|%s|%s|%s|%s|%s" % (result["name"], result["address"], result["delivery"], result["cases"], result["hours"], result["type"], result["location"]["geometry"]["location"]["lat"], result["location"]["geometry"]["location"]["lng"])
    return result

locations = []
soup = BeautifulSoup(r.text)
for thing in soup.find(id="wheretobuy-left").children:
  result = process(thing)
  if result != None:
    locations.append(result)
for thing in soup.find(id="wheretobuy-right").children:
  result = process(thing)
  if result != None:
    locations.append(result)




f = open('locations.json', 'w')
f.write(json.dumps(locations))

csvstring = "%s|%s|%s|%s|%s|%s|%s|%s\n" % ("Name","Address","Delivery Date","Cases Available","Hours Open","Type","Lat","Lng")
for loc in locations:
  csvstring += loc["csv"] + "\n"


f = open('locations.csv', 'w')
f.write(csvstring)

print "Done"