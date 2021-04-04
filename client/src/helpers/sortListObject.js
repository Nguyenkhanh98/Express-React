function swap(array, i, j, displayVar) {
    [array[i], array[j]] = [
        {
            [displayVar]: array[j][displayVar],
            id: array[j].id,
            value: array[j].id,
            label: array[j][displayVar],
        },
        {
            [displayVar]: array[i][displayVar],
            id: array[i].id,
            value: array[i].id,
            label: array[i][displayVar],
        },
    ];
}

export default (arr, fieldSort, options = { displayVar: '' }) => {
    let swapped;
    var count = arr.length - 1;
    let { displayVar } = options;

    if (displayVar === '') {
        displayVar = 'name';
    }

    do {
        swapped = false;
        for (let i = 0; i < count; i++) {
            if (arr[i] && arr[i + 1] && arr[i][fieldSort] > arr[i + 1][fieldSort]) {
                swap(arr, i, i + 1, displayVar);
                swapped = true;
            } else {
                arr[i + 1] = {
                    [displayVar]: arr[i + 1][displayVar],
                    id: arr[i + 1].id,
                    value: arr[i + 1].id,
                    label: arr[i + 1][displayVar],
                };
            }
        }
        count--;
    } while (swapped);
    return arr;
};
