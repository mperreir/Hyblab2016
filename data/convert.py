#!/usr/bin/env python3

import json
import math
import csv
from collections import defaultdict

NUMBER_LSOA = 32844;

INDICATORS = {
    "Crime": "crime",
    "Index of Multiple Deprivation (IMD)": "IMD",
    "Income": "income",
    "Employment": "employment",
    "Education, Skills and Training": "education",
    "Health Deprivation and Disability": "health",
    "Barriers to Housing and Services": "housing",
    "Living Environment": "environment"
}

SUFFIXES = {
    " Rank (where 1 is most deprived)": "rank",
    " Decile (where 1 is most deprived 10% of LSOAs)": "decile",
    " Score": "raw"
}

TO_COPY = [
    "Longitude",
    "Latitude",
    "LSOA11CD",
    "MSOA11CD"
]

def convert_numbers(d):
    try:
        for key, value in d.items():
            try:
                d[key] = float(value)
            except Exception:
                pass

            try:
                convert_numbers(d[key])
            except Exception:
                pass
    except Exception:
        pass

def filter_row(row):
    return row

def calculate_exp(data):
    for v in data.values():
        for short_id in INDICATORS.values():
            v[short_id]["exp"] = (
                -23 * math.log(1 - v[short_id]["rank"] / NUMBER_LSOA * (
                    1 - math.exp(-100 / 23))
                )
            )

def main():
    with open('IMD_Preston_Complete.csv', newline='') as f:
        raw_data = list(csv.DictReader(f))

    data = {row["LSOA11CD"]: filter_row(row) for row in raw_data}
    data = defaultdict(dict)
    for row in raw_data:
        lsoa11cd = row["LSOA11CD"]
        for long_id, short_id in INDICATORS.items():
            data[lsoa11cd][short_id] = {
                short_suffixe: row[long_id + long_suffixe]
                for long_suffixe, short_suffixe
                in SUFFIXES.items()
            }
        for key in TO_COPY:
            data[lsoa11cd][key] = row[key]

    for lsoa11cd, lsoa in data.items():
        lsoa["PCD7s"] = sorted([
                row["PCD7"]
                for row
                in raw_data
                if row["LSOA11CD"] == lsoa11cd
        ])
        lsoa["PCD8s"] = sorted([
                row["PCD8"]
                for row
                in raw_data
                if row["LSOA11CD"] == lsoa11cd
        ])

    with open('Mean_Wellbeing_Scores_Preston_LSOA.csv', newline='') as f:
        satisfaction = list(csv.DictReader(f))

    for lsoa in satisfaction:
        lsoa11cd = lsoa["REF"].split("/")[-1]
        keys_to_keep = {
            "How satisfied are you with your life",
            "How happy did you feel yesterday",
            "To what extent do you think the things you do are worthwhile"
        }
        if not lsoa11cd in data:
            print("Unknown LSOA11CD: {}".format(lsoa11cd))
            continue
        data[lsoa11cd]["satisfaction"] = {
            key: lsoa[key]
            for key
            in keys_to_keep
        }

    with open("imd_newgroups.csv", newline="") as f:
        ages = list(csv.DictReader(f))

    for row in ages:
        lsoa11cd = row["LSOA11CD"]
        keys = [
            "0-15.p",
            "16-25.p",
            "26-35.p",
            "36-55.p",
            "56-90.p",
            "ages.average",
            "0-15",
            "16-25",
            "26-35",
            "36-55",
            "56-90",
            "ages.average"
        ]

        data[lsoa11cd]["ages"] = {key: row[key] for key in keys}

    convert_numbers(data)

    calculate_exp(data)

    with open('data.json', 'w') as f:
        f.write("window.data = ")
        json.dump(data, f, indent="  ", allow_nan=False, sort_keys=True)
        f.write("\n")

if __name__ == "__main__":
    main()
