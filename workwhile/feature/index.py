from concurrent.futures import ThreadPoolExecutor, wait
import pdb
from typing import Optional, Tuple
import requests
from datetime import date, datetime
from haversine import haversine, Unit


DEFAULT_MAX_RETRY = 3

# ISO formatted UTC timestamps
# Basic resp
"""
    'id': 998,
    'lat': 37.77659192279328,
    'long': -122.4019021997006,
    'name': 'Company 998',
    'shift_start': '2025-04-21 17:58:01.863841',
    'shift_end': '2025-04-22 01:58:01.863841',
    'workers_requested': 8,
    'workers_scheduled': 1,
    'pay': 23.63
"""


def get_shifts(
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    dist_filtering: Optional[Tuple[int, int, int]] = None,
):
    url = "https://ww-backend-project.replit.app/backend/shifts"

    retry = 0
    while retry < DEFAULT_MAX_RETRY:
        print("LOG: calling GET shifts")
        resp = requests.get(url)
        print("LOG: finished calling GET shifts")
        if resp.status_code == 200:
            break
        elif resp.status_code >= 500 and resp.status_code < 600:
            retry += 1
            print(
                f"GET shifts failed with {resp.status_code}, retry {retry}/{DEFAULT_MAX_RETRY}"
            )
        else:
            # handle error if need to
            raise Exception("GET shifts failed", resp.content)

    all_shifts = resp.json()["shifts"]
    open_shifts = []
    for shift in all_shifts:
        if shift["workers_requested"] <= shift["workers_scheduled"]:
            continue
        # assumption
        # from_date <= shift_start <= shift_end <= to_date
        if from_date and from_date > datetime.fromisoformat(shift["shift_start"]):
            continue

        if to_date and to_date < datetime.fromisoformat(shift["shift_end"]):
            continue

        if dist_filtering:
            lat, long, max_distance = dist_filtering
            if haversine((shift["lat"], shift["long"]), (lat, long)) > max_distance:
                continue
        open_shifts.append(shift)

    return open_shifts


"""
    "user_id": 5,
    "sort_preference": "pay" / "starts_soonest" / "starts_latest"
"""


def get_user_preferences(user_id: int):
    url = f"https://ww-backend-project.replit.app/backend/user_preferences/{user_id}"

    resp = requests.get(url)
    retry = 0
    while retry < DEFAULT_MAX_RETRY:
        print("LOG: calling GET user_preferences")
        resp = requests.get(url)
        print("LOG: finished GET user_preferences")
        if resp.status_code == 200:
            break
        elif resp.status_code == 404:
            print(f"GET user preferences {user_id} failed with 404, defaulting to pay")
            return "pay"
        elif resp.status_code >= 500 and resp.status_code < 600:
            retry += 1
            print(
                f"GET user preferences {user_id} failed with {resp.status_code}, retry {retry}/{DEFAULT_MAX_RETRY}"
            )
        else:
            raise Exception(f"GET user preferences {user_id} failed", resp.content)

    resp_json = resp.json()
    return resp_json["sort_preference"]


def get_shifts_for_user(
    user_id: int,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    dist_filtering: Optional[Tuple[int, int, int]] = None,
):
    executor = ThreadPoolExecutor(max_workers=2)
    open_shifts_request = executor.submit(get_shifts, from_date, to_date, dist_filtering)
    sort_order_request = executor.submit(get_user_preferences, user_id)
    # Wait all workers finished
    wait([open_shifts_request, sort_order_request])
    open_shifts = open_shifts_request.result()
    sort_order = sort_order_request.result()

    if sort_order == "pay":
        return sorted(open_shifts, key=lambda x: x["pay"], reverse=True)
    elif sort_order == "starts_soonest":
        return sorted(open_shifts, key=lambda x: x["shift_start"])
    else:
        return sorted(open_shifts, key=lambda x: x["shift_start"], reverse=True)


def pretty_print(shifts, lat, long):
    for shift in shifts:
        print(
            f"Shift {('00' + str(shift['id']))[-3:]}, {shift['shift_start']}-{shift['shift_end']}, pay {shift['pay']}"
        )
        print(
            f"--- Lat {shift['lat']}, long {shift['long']}, dist {haversine((shift['lat'], shift['long']), (lat, long))}"
        )


# Optimizing performance:
# 1. Can we not do it? -> convert it from REST requests to just internal db reads/grpc internal service
# 2. Can we do it less? -> caching (how do you invalidate cache if user updates their preferences
# -> no idea within the context of this problem)
# 3. Can we do it parallelly? -> YES. We can call both GET shifts & GET user_preferences at the same time
#
for i in range(100):
    print(f"Getting for user {i}")
    try:
        temp = get_shifts_for_user(
            i,
            datetime.fromisoformat("2025-04-16 00:00:00.000000"),
            datetime.fromisoformat("2025-04-17 23:59:59.999999"),
            (37.77473664713572, -122.40741825648658, 1),
        )
        print("Major success")
    except Exception as e:
        pdb.set_trace()
