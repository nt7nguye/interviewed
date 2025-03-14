"""
One of the essential functions of your schedule module should be to retrieve a list of workers available for a specific time slot.

For this, we need you to create a simple function. It should take in workers’ schedule (indicating times in which they cannot work a shift) and the desired time slot, then return a list of available workers.

💡 Please note, this is a simplified version of the problem to keep the scope manageable for this interview.

Here's an example in Python to illustrate this functionality:
"""

# Sorted by start time
ex_schedule = {
    "worker_1": [(9, 11), (13, 15), (21, 23)],
    "worker_2": [(3, 8), (13, 16)],
    "worker_3": [(10, 17)],
    "worker_4": [(11, 12)],
    "worker_5": [(15, 17), (20, 23)],
}

ex_time_range = (10, 13)
expected_output = ["worker_2", "worker_5"]


def find_available_workers(schedule, time_range):
    avail = []
    for worker, worker_schedule in schedule.items():
        overlap = False
        for start, end in worker_schedule:
            # If overlap continue to next worker
            if time_range[0] > start and time_range[0] < end:
                overlap = True
                break
            if time_range[1] > start and time_range[1] < end:
                overlap = True
                break
            if time_range[0] < start and time_range[1] > end:
                overlap = True
                break
        if not overlap:
            avail.append(worker)
    return avail


def main():
    avail = find_available_workers(ex_schedule, ex_time_range)
    print(avail)


if __name__ == "__main__":
    main()
