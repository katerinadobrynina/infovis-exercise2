from flask import Flask, render_template
import pandas as pd
import json

app = Flask(__name__)

# auto reload
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True


COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina',
    'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Brazil',
    'Bulgaria', 'Cameroon', 'Chile', 'China', 'Colombia',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Ecuador',
    'Egypt, Arab Rep.', 'Eritrea', 'Ethiopia', 'France',
    'Germany', 'Ghana', 'Greece', 'India', 'Indonesia',
    'Iran, Islamic Rep.', 'Iraq', 'Ireland', 'Italy', 'Japan',
    'Jordan', 'Kazakhstan', 'Kenya', 'Lebanon', 'Malta',
    'Mexico', 'Morocco', 'Pakistan', 'Peru', 'Philippines',
    'Russian Federation', 'Syrian Arab Republic', 'Tunisia',
    'Turkey', 'Ukraine'
]


@app.route('/')
def data():

    # load csv
    df = pd.read_csv("static/data/clean_data.csv", on_bad_lines="skip")

    # filter countries
    df = df[df["Country Name"].isin(COUNTRIES)]

    # convert to records
    data_json = df.to_dict(orient="records")

    # send to html
    return render_template(
        "index.html",
        data=json.dumps(data_json)
    )


if __name__ == '__main__':
    app.run()