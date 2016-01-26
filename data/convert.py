#!/usr/bin/env python3

import json
import csv

def convert_numbers(d):
    try:
        for key, value in d.items():
            try:
                d[key] = float(value)
            except Exception:
                pass
            convert_numbers(d[key])
    except Exception:
        pass

def filter_row(row):
    return row

def main():
    with open('IMD_Preston_Complete.csv', newline='') as f:
        raw_data = list(csv.DictReader(f))

    data = {row["LSOA11CD"]: filter_row(row) for row in raw_data}
    lsoas = data.keys()

    for lsoa11cd, lsoa in data.items():
        lsoa["PCD7s"] = [
                row["PCD7"]
                for row
                in raw_data
                if row["LSOA11CD"] == lsoa11cd
        ]
        lsoa["PCD8s"] = [
                row["PCD8"]
                for row
                in raw_data
                if row["LSOA11CD"] == lsoa11cd
        ]

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

    convert_numbers(data)

    with open('data.json', 'w') as f:
        f.write("window.data = ")
        json.dump(data, f)

if __name__ == "__main__":
    main()
