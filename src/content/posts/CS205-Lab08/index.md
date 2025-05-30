---
title: CS205 Lab08 SIMD and OpenMP
published: 2025-05-08
updated: 2025-05-14
description: '本实验主要介绍 SIMD（单指令多数据）和 OpenMP 并行编程的基础知识。我们将探讨 Intel 和 ARM 平台上的 SIMD 指令集，学习如何使用 Intrinsics 加速程序，并了解 OpenMP 的基本用法。'
image: ''
tags: [ComputerScience,ProgramDesign,Cpp,Ubuntu,Linux ]
category: 'ComputerScience-En'
draft: false 
lang: en
---

> [!TIP]
>
> Welcome to my CS205 lecture notes! Because the lecture is not in English, I will try my best to translate it.
>
> And at the same time, the `PPT`,`lab-file` also use the English,I will write **the English notes but not all.**

>[!NOTE]
>
>If you have a passion to konw more about the course, you can click the link below to learn more about the course.
>Read the repo.
>
>::github{repo="MongxinChan/CPP"}

> [!IMPORTANT]
>
> 由于本文篇幅过长，个人会添加适当的中文注解在里面。

## Topic Overview

- **SIMD Technology**:
    - Intel SIMD Development (MMX, SSE, AVX, AVX2, AVX-512)
    - ARM SIMD Technology (Neon, Helium, SVE, SVE2)
- **Intrinsics**:
    - Intel Intrinsics (Load, Operate, Store, Naming Conventions)
    - ARM Neon Intrinsics (Load, Operate, Store)
- **Compiling and Running SIMD Code**:
    - Tips for Intel CPUs (AVX2) (Enabling support, Memory Alignment, Compiler Optimizations)
    - Tips for ARM CPUs (NEON)
- **Introduction to OpenMP**:
    - Basic Usage (`#pragma omp parallel for`)
    - Compilation Options
- **Building Projects with CMake**:
    - `CMakeLists.txt` Example Configuration (SIMD, OpenMP, Optimization)
    - Build Steps
- **Introduction to Python **:
    - Installation, REPL, Basic Types, Mutability/Immutability, Boolean Values, Control Flow, Functions, Modules
- **Lab Exercises**:
    - SIMD and OpenMP Optimization for Vector Addition

## Foreword

Welcome to the Lab 8 study notes! This lab primarily introduces the fundamental concepts of SIMD (Single Instruction, Multiple Data) and OpenMP parallel programming. 

We will explore SIMD instruction sets on Intel and ARM platforms, learn how to use Intrinsics to accelerate programs, and understand the basic usage of OpenMP. Additionally, we will briefly cover the basics of the Python language.

#  SIMD Technology Overview

**SIMD** (Single Instruction, Multiple Data) is a **<u>parallel computing method</u>** that allows a processor to perform the same operation on multiple data elements simultaneously using a single instruction.

## 1.1 Intel SIMD Development

SIMD technology on Intel platforms has undergone a series of developments:

- **MMX** (MultiMedia eXtensions): 1997, introduced 64-bit registers.
- **SSE** (Streaming SIMD Extensions): 1999, introduced 128-bit registers.
- **SSE2**: 2000
- **SSE3**: 2004
- **SSSE3**: 2006
- **SSE4.1**: 2006
- **SSE4.2**
- **AVX** (Advanced Vector Extensions): 2011, extended to 256-bit registers.
- **AVX2**: 2013
- **AVX-512**: 2016, extended to 512-bit registers.

```
[Image of Intel SIMD Development History Diagram]
```

## 1.2 ARM SIMD Technology

ARM platforms also have their own SIMD extensions:

- **Neon**: Supports 64-bit and 128-bit operations.
- **Helium (MVE - M-Profile Vector Extension)**: Provides more instructions.
- **SVE (Scalable Vector Extension)**: Vector length can scale from 128 bits to 2048 bits.
- **SVE2**: Enhanced version of SVE.

```
[Image of ARM SIMD Register Diagram]
```

#  Introduction to Intrinsics

Intrinsics are special functions that map directly to processor SIMD instructions, allowing developers to leverage SIMD's parallel processing capabilities in high-level languages (like C/C++).

## 2.1 Intel Intrinsics

- **Intel Intrinsics Guide**: https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html
  
    - You can search this website for specific intrinsic functions, e.g., `_mm256_load_ps`.
    
- **Common Operations**:
  
    ![image-20250520161900411](./images/image-20250520161900411-1747732448008-18.png)
    
    - **Load Data**: Load data from memory into SIMD registers.
        - `__m256 a = _mm256_load_ps(float *mem_addr);` (for aligned memory)
        
            ```cpp
            for(size_t i=0;i<n;i+=8){
                a=_mm256_load_ps(p1+i);
                b=_mm256_load_ps(p2+i);
                //_loadu here is for unaligned memeory
                
                c=_mm256_load_ps(c,_mm256_mul_ps(a,b));
            }
            _mm256_load_ps(sum,c);
            //_storeu here is for unaligned memory
            ```
        
            
        
        - `__m256 a = _mm256_loadu_ps(float *mem_addr);` (for unaligned memory)
        
            ```cpp
            size_t nSize=200000009;
            //float *p1 =new float[nSize]();
            //float *p2 =new float[nSize]();
            
            //256bits align ,C++17 standard
            float *p1=static_cast<float*>(aligned_alloc(256,nSize*sizeof(float)));
            float *p2=static_cast<float*>(aligned_alloc(256,nSize*sizeof(float)));
            float result=0.0f;
            //Aligned memory allocation
            ```
        
            
        
    - **Arithmetic Operations (Add, Multiply, etc.)**:
      
        ![image-20250520161752592](./images/image-20250520161752592-1747732448008-19.png)
        
        - `__m256 c = _mm256_add_ps(__m256 a, __m256 b);`
        - `__m256 c = _mm256_mul_ps(__m256 a, __m256 b);`
        
    - **Store Data**: Store data from SIMD registers back to memory.
      
        ![image-20250520161816838](./images/image-20250520161816838-1747732448008-20.png)
        
        - `_mm256_store_ps(float *mem_addr, __m256 a);` (for aligned memory)
        - `_mm256_storeu_ps(float *mem_addr, __m256 a);` (for unaligned memory)
    
- **Naming Conventions**:
    - `ps`: Packed Single-precision (float)
    - `pd`: Packed Double-precision (double)

## 2.2 ARM Neon Intrinsics

![image-20250520161835864](./images/image-20250520161835864-1747732448008-21.png)

- **ARM Intrinsics Guide**: https://developer.arm.com/architectures/instruction-sets/intrinsics/

- Neon intrinsics operate on 128-bit registers.

- **Common Operations (example with float32x4_t, representing 4 32-bit floats)**:
  
    ![image-20250520161933569](./images/image-20250520161933569-1747732448008-22.png)
    
    - **Load Data**: `float32x4_t vec = vld1q_f32(const float32_t *ptr);`
    
    ![image-20250520161947015](./images/image-20250520161947015-1747732448008-23.png)
    
    - **Arithmetic Operations**: `float32x4_t sum = vaddq_f32(float32x4_t a, float32x4_t b);`
    
    ![image-20250520161954653](./images/image-20250520161954653-1747732448009-24.png)
    
    - **Store Data**: `vst1q_f32(float32_t *ptr, float32x4_t vec);`

![image-20250517154409716](./images/image-20250517154409716-1747732448009-25.png)



#  Tips for Compiling and Running SIMD Code

## 3.1 For Intel CPUs (AVX2)

- **Enable AVX2 Support**:

    - Check macro definition in code:

        ```cpp
        #ifdef WITH_AVX2
        // AVX2 specific code
        #else
        std::cerr << "AVX2 is not supported" << std::endl;
        #endif
        ```

    - Define macro at compile time: `g++ ... -DWITH_AVX2 ...`

    - Use compiler option to enable AVX2 instruction set: `g++ ... -mavx2 ...`

    - If you encounter "inlining failed" or segmentation faults, ensure both `-DWITH_AVX2` and `-mavx2` are used correctly.

- **Memory Alignment**:

    - AVX instructions (like `_mm256_load_ps`) often require memory addresses to be aligned to specific boundaries (e.g., 32-byte alignment for AVX2).

    - If memory is unaligned, use `_mm256_loadu_ps` and `_mm256_storeu_ps`.

    - Allocate aligned memory (C++17 and later):

        ```cpp
        // 256 bits aligned, C++17 standard
        float * p1 = static_cast<float*>(aligned_alloc(32, nSize * sizeof(float)));
        ```
        
        > [!NOTE]
        >
        > The first argument to aligned_alloc is the alignment in bytes,the second is the total number of bytes to allocate, which must be a multiple of the first.
        >
        > Requires `<cstdlib>`.
        >
        > Must be freed with free(p1);

- **Compiler Optimization**: Use the `-O3` optimization level for **better performance.**

## 3.2 For ARM CPUs (NEON)

- **Enable NEON Support**:

    - ARM compilers usually enable NEON by default (e.g., when compiling for specific ARMv7/ARMv8 architectures).
    - Check compiler documentation for specific flags, e.g., `-mfpu=neon` or `-march=armv8-a+simd`.
    - Include header file: `#include <arm_neon.h>`

- Example Compilation Command (General **<u>if the compiler and target platform support NEON)</u>**:

    ```bash
    g++ *.cpp -o main
    ./main
    ```
    
    ![image-20250520162219973](./images/image-20250520162219973-1747732448009-26.png)

## 3.3 Compilation Tips

- If compiling the example code directly with `g++ *.cpp -o main`:

    ![image-20250520162510536](./images/image-20250520162510536-1747732448009-27.png)

    - When running on an Intel CPU, ensure `main.cpp` calls `dotproduct_avx2()` instead of `dotproduct_neon()`.
    - Outputting "NEON is not supported" or "AVX2 is not supported" means the respective SIMD instruction set was not compiled or the CPU does not support it.

- <u>**Correctly**</u> Compiling AVX2 Example:

    ![image-20250520170004559](./images/image-20250520170004559-1747732448009-28.png)

    ```bash
    g++ -o main *.cpp -DWITH_AVX2 -mavx2 -O3
    ```

- **OpenMP Support**:

    - Include header file: `#include <omp.h>`
    - Add OpenMP flag at compile time: `g++ ... -fopenmp ...`

#  Introduction to OpenMP

OpenMP (Open Multi-Processing) is an API for shared-memory parallel programming, consisting of a set of compiler directives, library routines, and environment variables.

- **Basic Usage**: Use `#pragma omp` directives to parallelize code blocks, such as loops.

    ```cpp
    #pragma omp parallel for
    for (int i = 0; i < n; ++i) {
        // Iterations of this loop will be executed in parallel across multiple threads
    }
    ```

- **Compilation**: Requires a compiler that supports OpenMP and usually a specific compilation option (like `-fopenmp` in GCC/Clang).

# Building Projects with CMake

CMake is a cross-platform build system generator. It can be used to manage the compilation process of projects, including handling compilation options for SIMD and OpenMP.

## 5.1 CMakeLists.txt Example Configuration

```cmake
cmake_minimum_required(VERSION 3.12)
project(simd_openmp_lab)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add source files
add_executable(my_program main.cpp matoperation.cpp)

# --- SIMD Configuration ---
# Check for AVX2 support (example, actual check might be more complex)
include(CheckCXXCompilerFlag)
CHECK_CXX_COMPILER_FLAG("-mavx2" COMPILER_SUPPORTS_AVX2)

if(COMPILER_SUPPORTS_AVX2)
    message(STATUS "AVX2 is supported by the compiler.")
    target_compile_options(my_program PRIVATE -mavx2)
    target_compile_definitions(my_program PRIVATE WITH_AVX2)
else()
    message(WARNING "AVX2 is not supported by the compiler.")
endif()

# --- OpenMP Configuration ---
find_package(OpenMP)
if(OpenMP_CXX_FOUND)
    message(STATUS "OpenMP found.")
    target_link_libraries(my_program PUBLIC OpenMP::OpenMP_CXX)
else()
    message(WARNING "OpenMP not found.")
endif()

# --- Optimization Level ---
target_compile_options(my_program PRIVATE -O3)
```

## 5.2 Build Steps

1. Create a `build` directory and navigate into it: `mkdir build && cd build`
2. Run CMake to generate build files: `cmake ..`
3. Compile the project: `make` (or `cmake --build .`)
4. Run the executable: `./my_program`

```bash
mkdir build && cd build
cmake ..
cmake --build #make
./my_program
```

#  Introduction to Python 

Python is an interpreted, high-level, object-oriented programming language.

## 6.1 Installing Python

- Download from the official website: https://www.python.org/downloads/

![image-20250520111013692](./images/image-20250520111013692-1747732448009-29.png)

- It is recommended to check "Add python.exe to PATH" during installation.

- If not checked, you need to configure environment variables manually.

    - Right click ‘my computer’ on the desktop
    - select ‘attribute’-> ‘advanced attribute’->environment variable
    - configure ‘Path’ with the path where python.exe belongs and its subdirectory ‘Scripts’

    ![image-20250520163514831](./images/image-20250520163514831-1747732448009-30.png)

    ![image-20250520165149775](./images/image-20250520165149775-1747732448009-31.png)

    > [!TIP]
    >
    > 如果这里没有配置好`\Scripts\`会导致后续如果要用pip安装需要:
    >
    > ```bash
    > cd C:\Path\Python311\Scripts
    > pip install somepackage
    > ```
    >
    > 所以要配置子文件夹

## 6.2 REPL (Read-Eval-Print Loop)

Python provides an interactive environment where you can directly input code and see the results.

```bash
python
```

Result:

![image-20250520163532435](./images/image-20250520163532435-1747732448009-32.png)

```python
a=1
b=2
a+b

a="hello world!"
print(a)

3*a
```

![image-20250520163709546](./images/image-20250520163709546-1747732448009-33.png)

## 6.3 Basic Types and Operations

- **Numeric Types**: `int`, `float`, `complex`
- **Boolean Type**: `True`, `False`
- **Text Sequence Type**: `str`
- **Sequence Types**: `list` (mutable), `tuple` (immutable), `range`
- **Set Type**: `set`
- **Dictionary Type**: `dict`
- **Binary Sequence Types**: `bytes`, `bytearray`

Reference from [the docs](https://docs.python.org/3/library/stdtypes.html)


### 6.3.1 Sequence Types

- **list**: Mutable, ordered collection of elements.
- **tuple**: Immutable, ordered collection of elements.
- **range**: Immutable sequence of numbers.

---
**Sequence Types**
List:
```python
animals = ['dog', 'cat', 'bird']
animals[0] # => 'dog'
animals[0] = 'puppy'
```

Tuple:
```python
animals = ('dog', 'cat', 'bird')
animals[0] # => 'dog'
animals[0] = 'puppy' 
# Traceback (most recent call last):
#    File "<stdin>", line 1, in <module>
#TypeError: 'tuple' object does not support item assignment
```

![image-20250520174919019](./images/image-20250520174919019.png)

---
**Unpacking from Sequence Types**
List:
```python
foo,bar=['dog','cat']
foo
bar
```

Tuple:
```python
foo,bar=('dog','cat')
foo
bar
```

### 6.3.2 Set & Dict
Set:
```python
animals = set()
animals.add('dog')
animals	# => {'dog'}
```

Dict:
```python
alias = dict()
alias['cat'] = 'kitty'
alias[['pig']] = ['hog']

#Traceback (most recent call last):
#    File "<stdin>", line 1, in <module>
#TypeError: 'tuple' object does not support item assignment
```
![image-20250520175139989](./images/image-20250520175139989.png)

## 6.4 Mutable & Immutable Types

- **Immutable Types**: `Numeric`, `Boolean`, `str`, `tuple`, `bytes` (content cannot be changed after creation)
- **Mutable Types**: `list`, `dict`, `set` (content can be modified)
- Only immutable types can be used as dictionary keys or set members.

```python
cubes=[1,88,23,65,125]      #cubes here is a list
cubes[3]=64                 #replace the item whose index is 3
cubes
```

![image-20250520175834465](./images/image-20250520175834465.png)

## 6.5 Boolean Value Evaluation

The following values are considered False:

None, False, 0, 0.0, 0j, Decimal(0), Fraction(0, 1), '', (), [], {}, set(), range(0)

```python
from fractions import Fraction
bool(None)

bool(Fraction(0,2))

bool('')

bool(' ')

bool(Fraction(0, 1))

```

![image-20250520175730842](./images/image-20250520175730842.png)

Other values are generally considered **True**.

## 6.6 Control Flow

- **if Statement**:

    ```python
    foo = []
    if foo: # Empty list is considered False
        print(foo)
    else:
        print('foo is empty')
    ```

- **for Loop**:

    ```python
    my_list = ['dog', 'cat', 'bird']
    for item in my_list:
        print(item)
    
    for index, value in enumerate(my_list):
        print(f"{index}: {value}")
    
    for i in range(5): # 0, 1, 2, 3, 4
        print(i, end=" ")
    ```

- **while Loop**:

    ```python
    count = 5
    while count > 0:
        print(count, end=" ")
        count -= 1
    ```

## 6.7 Defining Functions

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("World")
print(message) # Output: Hello, World!
```

## 6.8 Modules

- Python files (`.py`) can be imported as modules into other Python files.
- The filename (without the `.py` suffix) is the module name.
- Use `import module_name` or `from module_name import specific_function` to import.
- The `if __name__ == "__main__":` construct is used to determine if a script is run directly or imported.

#  Exercises

## Exercise 1: Vector Addition

Write a program to implement the addition of two floating-point vectors. The vector size should be greater than 1 million.

1. Implement using **pure** `C/C++` code.
2. Optimize the vector addition using SIMD (AVX2 or NEON) instructions.
3. Compare the execution speed of the pure C/C++ version and the SIMD optimized version.
4. Try to further accelerate the SIMD version of vector addition using OpenMP. Verify the correctness of the results.

**Hints**:

- Initialize vectors with values like `0.f, 1.f, 2.f, ...`.
- Pay attention to the importance of memory alignment for SIMD.
- Use timing functions (like the `<chrono>` library) to measure execution time.

```cpp
// Example Framework
#include <iostream>
#include <vector>
#include <chrono> // For timing
#include <numeric> // For std::iota (optional)
#include <cstdlib> // For aligned_alloc, free
#include <cmath>   // For std::abs (in result verification)

// If using AVX2
#ifdef WITH_AVX2
#include <immintrin.h>
#endif

// If using NEON
#ifdef WITH_NEON
#include <arm_neon.h>
#endif

// If using OpenMP
#ifdef _OPENMP
#include <omp.h>
#endif

const size_t VECTOR_SIZE = 2000000; // 2 million

// Function: Pure C++ vector addition
void vector_add_cpp(float* c, const float* a, const float* b, size_t n) {
    for (size_t i = 0; i < n; ++i) {
        c[i] = a[i] + b[i];
    }
}

// Function: AVX2 vector addition (Example)
#ifdef WITH_AVX2
void vector_add_avx2(float* c, const float* a, const float* b, size_t n) {
    size_t n_aligned_part = (n / 8) * 8; // Process the part divisible by 8

    for (size_t i = 0; i < n_aligned_part; i += 8) {
        __m256 va = _mm256_loadu_ps(a + i); // Use loadu for potentially unaligned memory
        __m256 vb = _mm256_loadu_ps(b + i);
        __m256 vc = _mm256_add_ps(va, vb);
        _mm256_storeu_ps(c + i, vc);      // Use storeu
    }
    // Handle the remaining elements if n is not a multiple of 8
    for (size_t i = n_aligned_part; i < n; ++i) {
        c[i] = a[i] + b[i];
    }
}

// Function: AVX2 + OpenMP vector addition (Example)
void vector_add_avx2_omp(float* c, const float* a, const float* b, size_t n_orig) {
    size_t n_parallel_part = (n_orig / 8) * 8; // Part to be processed in parallel

    #pragma omp parallel for
    for (size_t i = 0; i < n_parallel_part; i += 8) {
        __m256 va = _mm256_loadu_ps(a + i);
        __m256 vb = _mm256_loadu_ps(b + i);
        __m256 vc = _mm256_add_ps(va, vb);
        _mm256_storeu_ps(c + i, vc);
    }
    // Handle the remaining elements serially after the parallel loop
    for (size_t i = n_parallel_part; i < n_orig; ++i) {
        c[i] = a[i] + b[i];
    }
}
#endif


// ... (NEON version implementation would be similar) ...

int main() {
    // --- Memory Allocation ---
    // Consider alignment: AVX2 typically needs 32-byte alignment (256-bit)
    // C++17 aligned_alloc
    float* vec_a = static_cast<float*>(aligned_alloc(32, VECTOR_SIZE * sizeof(float)));
    float* vec_b = static_cast<float*>(aligned_alloc(32, VECTOR_SIZE * sizeof(float)));
    float* vec_c_cpp = static_cast<float*>(aligned_alloc(32, VECTOR_SIZE * sizeof(float)));
    float* vec_c_simd = static_cast<float*>(aligned_alloc(32, VECTOR_SIZE * sizeof(float)));
    float* vec_c_simd_omp = static_cast<float*>(aligned_alloc(32, VECTOR_SIZE * sizeof(float)));

    if (!vec_a || !vec_b || !vec_c_cpp || !vec_c_simd || !vec_c_simd_omp) {
        std::cerr << "Memory allocation failed!" << std::endl;
        // Clean up any successfully allocated memory
        if(vec_a) free(vec_a);
        if(vec_b) free(vec_b);
        if(vec_c_cpp) free(vec_c_cpp);
        if(vec_c_simd) free(vec_c_simd);
        if(vec_c_simd_omp) free(vec_c_simd_omp);
        return 1;
    }

    // --- Initialize Vectors ---
    for (size_t i = 0; i < VECTOR_SIZE; ++i) {
        vec_a[i] = static_cast<float>(i);
        vec_b[i] = static_cast<float>(VECTOR_SIZE - 1 - i);
    }

    // --- Pure C++ Version ---
    auto start_cpp = std::chrono::high_resolution_clock::now();
    vector_add_cpp(vec_c_cpp, vec_a, vec_b, VECTOR_SIZE);
    auto end_cpp = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> duration_cpp = end_cpp - start_cpp;
    std::cout << "CPP version duration: " << duration_cpp.count() << " ms" << std::endl;

    // --- SIMD Version (AVX2 Example) ---
#ifdef WITH_AVX2
    auto start_avx2 = std::chrono::high_resolution_clock::now();
    vector_add_avx2(vec_c_simd, vec_a, vec_b, VECTOR_SIZE);
    auto end_avx2 = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> duration_avx2 = end_avx2 - start_avx2;
    std::cout << "AVX2 version duration: " << duration_avx2.count() << " ms" << std::endl;

    // Verify results (simple sampling)
    bool avx2_correct = true;
    for(size_t i=0; i<VECTOR_SIZE; ++i) {
        if (std::abs(vec_c_cpp[i] - vec_c_simd[i]) > 1e-5) { // Use tolerance for floating-point comparison
            avx2_correct = false;
            std::cerr << "AVX2 Mismatch at index " << i << ": cpp=" << vec_c_cpp[i] << ", simd=" << vec_c_simd[i] << std::endl;
            break;
        }
    }
    std::cout << "AVX2 results are " << (avx2_correct ? "correct." : "INCORRECT!") << std::endl;


    // --- SIMD + OpenMP Version (AVX2 Example) ---
    #ifdef _OPENMP
    auto start_avx2_omp = std::chrono::high_resolution_clock::now();
    vector_add_avx2_omp(vec_c_simd_omp, vec_a, vec_b, VECTOR_SIZE);
    auto end_avx2_omp = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> duration_avx2_omp = end_avx2_omp - start_avx2_omp;
    std::cout << "AVX2 + OpenMP version duration: " << duration_avx2_omp.count() << " ms" << std::endl;

    bool avx2_omp_correct = true;
    for(size_t i=0; i<VECTOR_SIZE; ++i) {
        if (std::abs(vec_c_cpp[i] - vec_c_simd_omp[i]) > 1e-5) {
            avx2_omp_correct = false;
            std::cerr << "AVX2+OMP Mismatch at index " << i << ": cpp=" << vec_c_cpp[i] << ", simd_omp=" << vec_c_simd_omp[i] << std::endl;
            break;
        }
    }
    std::cout << "AVX2 + OpenMP results are " << (avx2_omp_correct ? "correct." : "INCORRECT!") << std::endl;
    #endif // _OPENMP
#endif // WITH_AVX2

    // ... (NEON version tests would be similar) ...

    // --- Free Memory ---
    free(vec_a);
    free(vec_b);
    free(vec_c_cpp);
    free(vec_c_simd);
    free(vec_c_simd_omp);

    return 0;
}
```

**Example Compilation Commands (GCC/Clang, assuming filename `lab08_exercise.cpp`):**

- **Pure C++**: 

    ```bash
    g++ lab08_exercise.cpp -o lab08_cpp -O3 -std=c++17
    ```

- **AVX2**: 

    ```bash
    g++ lab08_exercise.cpp -o lab08_avx2 -DWITH_AVX2 -mavx2 -O3 -std=c++17
    ```

- AVX2 + OpenMP: 

    ```bash
    g++ lab08_exercise.cpp -o lab08_avx2_omp -DWITH_AVX2 -mavx2 -fopenmp -O3 -std=c++17
    ```
    
    **For Clang, OpenMP** might **require linking additional libraries**, e.g., `-lomp`

![image-20250520165750672](./images/image-20250520165750672-1747732448009-34.png)

**Questions for Thought**:

- How much performance improvement did SIMD optimization provide?
- How much additional performance improvement can OpenMP provide on top of SIMD? Why?
- What is the impact of memory alignment on SIMD performance? What happens if you don't use aligned memory or `loadu/storeu` instructions?



**My thoughts**:



----

*CC BY NC SA (Content adapted from course materials)*
