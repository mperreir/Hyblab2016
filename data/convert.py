import json
import csv

def main():
    with open('IMD_Preston_Complete.csv', newline='') as f:
        data = list(csv.DictReader(f))

    data = {row["LSOA11CD"]: row for row in data}

    for lsoa11cd, lsoa in data.items():
        for key, value in lsoa.items():
            try:
                lsoa[key] = float(value)
            except Exception:
                pass


    with open('data.json', 'w') as f:
        f.write("window.data = ")
        json.dump(data, f)

if __name__ == "__main__":
    main()
