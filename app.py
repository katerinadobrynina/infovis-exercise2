from flask import Flask, render_template
import pandas as pd
import json
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import numpy as np

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
#    print("COLUMNS:", df.columns.tolist(), flush=True)

    # filter countries
    df = df[df["Country Name"].isin(COUNTRIES)]

    # convert to records
    data_json = df.to_dict(orient="records")

    # PCA for the most recent year
    latest_year = df["year"].max()
    df_latest = df[df["year"] == latest_year].copy()

    # numeric indicator columns
    exclude_cols = ["Country Name", "Country Code", "year"]
    feature_cols = [col for col in df_latest.columns if col not in exclude_cols]

    X = df_latest[feature_cols].apply(pd.to_numeric, errors="coerce")
    X = X.fillna(X.mean())

    # scale features
    X_scaled = StandardScaler().fit_transform(X)

    # PCA
    pca = PCA(n_components=2)
    pca_result = pca.fit_transform(X_scaled)

    pca_data = []
    for i, row in df_latest.reset_index(drop=True).iterrows():
        pca_data.append({
            "country": row["Country Name"],
            "x": float(pca_result[i, 0]),
            "y": float(pca_result[i, 1])
        })

    # send to html
    return render_template(
        "index.html",
        data=json.dumps(data_json),
        pca_data=json.dumps(pca_data)
    )


if __name__ == '__main__':
    app.run()