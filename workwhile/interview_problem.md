One of the essential functions of your schedule module should be to retrieve a list of workers available for a specific time slot.

For this, we need you to create a simple function. It should take in workers’ schedule (indicating times in which they cannot work a shift) and the desired time slot, then return a list of available workers.

💡 Please note, this is a simplified version of the problem to keep the scope manageable for this interview.

Here's an example in Python to illustrate this functionality:

```Python
schedule = {
    "worker_1": [(9, 11), (13, 15), (21, 23)],
    "worker_2": [(3, 8), (13, 16)],
    "worker_3": [(10, 17)],
    "worker_4": [(11, 12)],
    "worker_5": [(15, 17), (20, 23)],
}

time_range = (10, 13)
expected_output = ["worker_2", "worker_5"]
```



Input in Java:
```
Map<String, List<int[]>> schedule = new HashMap<>();
schedule.put("worker_1", Arrays.asList(new int[]{9, 11}, new int[]{13, 15}, new int[]{21, 23}));
schedule.put("worker_2", Arrays.asList(new int[]{3, 8}, new int[]{13, 16}));
schedule.put("worker_3", Arrays.asList(new int[]{10, 17}));
schedule.put("worker_4", Arrays.asList(new int[]{11, 12}));
schedule.put("worker_5", Arrays.asList(new int[]{15, 17}, new int[]{20, 23}));

int[] timeRange = {10, 13};
```

Input in typescript:
```Typescript
type TimeRange = [number, number];
type Schedule = Record<string, TimeRange[]>;

const schedule: Schedule = {
    "worker_1": [[9, 11], [13, 15], [21, 23]],
    "worker_2": [[3, 8], [13, 16]],
    "worker_3": [[10, 17]],
    "worker_4": [[11, 12]],
    "worker_5": [[15, 17], [20, 23]],
};

const timeRange: TimeRange = [10, 13];
```

Input in javascript:
```Javascript
const schedule = {
    "worker_1": [[9, 11], [13, 15], [21, 23]],
    "worker_2": [[3, 8], [13, 16]],
    "worker_3": [[10, 17]],
    "worker_4": [[11, 12]],
    "worker_5": [[15, 17], [20, 23]],
};

const timeRange = [10, 13];
```