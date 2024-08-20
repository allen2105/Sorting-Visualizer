// DOM elements
const arraySizeInput = document.getElementById('arraySize');
const speedInput = document.getElementById('speed');
const arraySizeValue = document.getElementById('arraySizeValue');
const speedValue = document.getElementById('speedValue');
const visualizer = document.getElementById('visualizer');
const generateArrayBtn = document.getElementById('generateArray');
const startSortBtn = document.getElementById('startSort');
const algorithmSelect = document.getElementById('algorithm');

// Global variables
let array = [];
let delay = 50;

// Update the displayed value for array size and speed
arraySizeInput.addEventListener('input', () => {
    arraySizeValue.textContent = arraySizeInput.value;
    generateNewArray();
});

speedInput.addEventListener('input', () => {
    speedValue.textContent = speedInput.value;
    delay = Math.max(1, (101 - speedInput.value) * 10); // Adjust speed range for slower speeds
});

// Initialize the array and display
function generateNewArray() {
    const size = arraySizeInput.value;
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 10);
    displayArray();
}

// Display the array
async function displayArray(highlightIndices = [], sorted = false) {
    return new Promise(resolve => {
        visualizer.innerHTML = '';
        const containerWidth = visualizer.clientWidth;
        const barWidth = (containerWidth / array.length) - 2; // Adjust bar width and margin
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.style.height = `${(value / 100) * 100}%`;
            bar.style.width = `${barWidth}px`;
            bar.style.backgroundColor = highlightIndices.includes(index)
                ? '#e74c3c' // Red for highlighted bars
                : sorted ? '#2ecc71' : '#3498db'; // Green if sorted, default color otherwise
            bar.style.margin = '0 1px';
            bar.style.position = 'absolute';
            bar.style.bottom = '0';
            bar.style.left = `${index * (barWidth + 2)}px`;
            visualizer.appendChild(bar);
        });
        setTimeout(resolve, delay);
    });
}

// Generate a new array on page load
generateNewArray();

// Add event listeners for buttons
generateArrayBtn.addEventListener('click', generateNewArray);

startSortBtn.addEventListener('click', async () => {
    const algorithm = algorithmSelect.value;
    switch (algorithm) {
        case 'bubbleSort':
            await bubbleSort();
            break;
        case 'selectionSort':
            await selectionSort();
            break;
        case 'insertionSort':
            await insertionSort();
            break;
        case 'quickSort':
            await quickSort();
            break;
        case 'heapSort':
            await heapSort();
            break;
        case 'mergeSort':
            await mergeSort();
            break;
    }
});

// Sorting algorithms
async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            await displayArray([i, j]);
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swap(i, minIndex);
            await displayArray([i, minIndex]);
        }
    }
    await displayArray([], true); // Highlight the entire array as sorted
}

async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            await displayArray([j, j + 1]);
            if (array[j] > array[j + 1]) {
                swap(j, j + 1);
                await displayArray([j, j + 1]);
            }
        }
    }
    await displayArray([], true); // Highlight the entire array as sorted
}

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            await displayArray([j, i]);
            array[j + 1] = array[j];
            j--;
            await displayArray([j + 1, j]);
        }
        array[j + 1] = key;
    }
    await displayArray([], true); // Highlight the entire array as sorted
}

async function quickSort(start = 0, end = array.length - 1) {
    if (start >= end) return;

    let index = await partition(start, end);
    await Promise.all([
        quickSort(start, index - 1),
        quickSort(index + 1, end)
    ]);

    if (start === 0 && end === array.length - 1) {
        await displayArray([], true); // Highlight the entire array as sorted
    }
}

async function partition(start, end) {
    let pivotIndex = start;
    let pivotValue = array[end];
    for (let i = start; i < end; i++) {
        await displayArray([i, end]);
        if (array[i] < pivotValue) {
            swap(i, pivotIndex);
            pivotIndex++;
            await displayArray([i, pivotIndex]);
        }
    }
    swap(pivotIndex, end);
    await displayArray([pivotIndex, end]);
    return pivotIndex;
}

async function heapSort() {
    let n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        swap(0, i);
        await displayArray([0, i]);
        await heapify(i, 0);
    }

    await displayArray([], true); // Highlight the entire array as sorted
}

async function heapify(n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        swap(i, largest);
        await displayArray([i, largest]);
        await heapify(n, largest);
    }
}

async function mergeSort(start = 0, end = array.length - 1) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);

    if (start === 0 && end === array.length - 1) {
        await displayArray([], true); // Highlight the entire array as sorted
    }
}

async function merge(start, mid, end) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);

    let k = start;
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        await displayArray([k]);
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        k++;
    }

    while (i < left.length) {
        await displayArray([k]);
        array[k] = left[i];
        i++;
        k++;
    }

    while (j < right.length) {
        await displayArray([k]);
        array[k] = right[j];
        j++;
        k++;
    }
}

// Helper function to swap elements in the array
function swap(i, j) {
    [array[i], array[j]] = [array[j], array[i]];
}
