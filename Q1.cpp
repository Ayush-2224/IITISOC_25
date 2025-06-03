#include <iostream>
#include <vector>
#include <list>
using namespace std;

// Function to implement DR Algorithm using Array of Linked Lists
void DR_Array_LinkedLists(vector<int>& arr) {
    int n = arr.size();
    vector<list<int>> buckets(n);
    vector<int> output;

    // First pass: distribute elements into linked lists based on remainder
    for (int num : arr) {
        int remainder = num % n;
        buckets[remainder].push_back(num);
    }
    
    bool elements_remaining = true;
    while (elements_remaining) {
        elements_remaining = false;
        vector<list<int>> new_buckets(n);
        for (int i = 0; i < n; i++) {
            auto it = buckets[i].begin();
            while (it != buckets[i].end()) {
                int num = *it;
                if (num < n) { // Move directly to output if num < n
                    output.push_back(num);
                    it = buckets[i].erase(it);
                } else {
                    int new_dividend = num / n;
                    int new_remainder = new_dividend % n;
                    new_buckets[new_remainder].push_back(new_dividend);
                    it = buckets[i].erase(it);
                    elements_remaining = true;
                }
            }
        }
        buckets = move(new_buckets);
    }
    
    // Print sorted output
    cout << "Sorted Output (Linked List Approach): ";
    for (int num : output) cout << num << " ";
    cout << endl;
}

// Function to implement DR Algorithm using Arrays
void DR_Array(vector<int>& arr) {
    int n = arr.size();
    vector<int> temp(arr);
    vector<int> output;
    
    bool elements_remaining = true;
    while (elements_remaining) {
        elements_remaining = false;
        vector<vector<int>> buckets(n);
        
        // Distribute elements into arrays based on remainder
        for (int num : temp) {
            int remainder = num % n;
            buckets[remainder].push_back(num);
        }
        
        // Collect elements with dividend < n, and prepare for next pass
        temp.clear();
        for (int i = 0; i < n; i++) {
            for (int num : buckets[i]) {
                if (num < n) {
                    output.push_back(num);
                } else {
                    int new_dividend = num / n;
                    temp.push_back(new_dividend);
                    elements_remaining = true;
                }
            }
        }
    }
    
    // Print sorted output
    cout << "Sorted Output (Array Approach): ";
    for (int num : output) cout << num << " ";
    cout << endl;
}

int main() {
    vector<int> arr = {125, 167, 120, 115, 189, 111, 89, 127, 168, 128, 157, 125};
    
    // DR Algorithm using Array of Linked Lists
    DR_Array_LinkedLists(arr);
    
    // DR Algorithm using Arrays
    DR_Array(arr);
    
    return 0;
}
