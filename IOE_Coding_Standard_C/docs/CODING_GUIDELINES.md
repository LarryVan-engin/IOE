# IOE INNOVATION Team - Coding Guidelines

## Tổng quan
Tài liệu này định nghĩa các tiêu chuẩn lập trình chính thức cho IOE INNOVATION Team. Các quy tắc này được thiết kế để đảm bảo tính nhất quán, chất lượng và khả năng bảo trì của mã nguồn.

## 1. Cấu trúc File và General Information Header

### 1.1 General Information Header bắt buộc
Mọi file .c và .h phải bắt đầu với header thông tin đầy đủ:

```c
/*******************************************************************************************************************
 * General Information
 ********************************************************************************************************************
 * Project:       [Tên dự án]
 * File:          [Tên file và extension]
 * Description:   [Mô tả ngắn gọn chức năng của file]
 * 
 * Author:        [Tên tác giả]
 * Email:         [Email liên hệ]
 * Created:       [Ngày tạo - YYYY-MM-DD]
 * Last Update:   [Ngày cập nhật cuối - YYYY-MM-DD]
 * Version:       [Version number - X.Y.Z]
 * 
 * Hardware:      [Target hardware/platform]
 * Compiler:      [Compiler và version]
 * 
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       [Loại license]
 * 
 * Dependencies:  [Danh sách dependencies nếu có]
 *                - [Dependency 1]
 *                - [Dependency 2]
 * 
 * Notes:         [Ghi chú bổ sung]
 *                - [Note 1]
 *                - [Note 2]
 *******************************************************************************************************************/
```

### 1.2 Thông tin bắt buộc trong header
- **Project**: Tên dự án cụ thể
- **File**: Tên file chính xác bao gồm extension
- **Description**: Mô tả ngắn gọn (1-2 câu) về chức năng
- **Author**: Tên đầy đủ của người tạo file
- **Email**: Email liên hệ (có thể là team email)
- **Created**: Ngày tạo file (format YYYY-MM-DD)
- **Last Update**: Ngày cập nhật gần nhất
- **Version**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Hardware**: Platform target (STM32F4xx, Generic C, etc.)
- **Compiler**: Compiler và version tối thiểu
- **Copyright**: Thông tin bản quyền
- **License**: Loại giấy phép (MIT, GPL, Proprietary, etc.)

## 2. Cấu trúc Code Organization

### 2.1 Thứ tự các section trong file .h
```c
/* General Information Header */

#ifndef HEADER_GUARD
#define HEADER_GUARD

#ifdef __cplusplus
extern "C" {
#endif

/**********************************************************************************************************************
 * Includes
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Macro definitions
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Typedef definitions
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Exported global variables
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Exported global functions (API)
 *********************************************************************************************************************/

#ifdef __cplusplus
}
#endif

#endif /* HEADER_GUARD */

/* End of File comment */
```

### 2.2 Thứ tự các section trong file .c
```c
/* General Information Header */

/**********************************************************************************************************************
 * Includes
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Macro definitions
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Typedef definitions
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Private function prototypes
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * ISR prototypes
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Private global variables
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Global variables
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @addtogroup GROUP_NAME
 * @{
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Function Implementation
 *********************************************************************************************************************/

/* Public functions here */

/******************************************************************************************************************//**
 * @} (end addtogroup GROUP_NAME)
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Private Functions
 *********************************************************************************************************************/

/* Private functions here */

/* End of File comment */
```


## 2.5 Naming Convention - Subject_Verb (S_V) Pattern

### 2.5.1 Tổng quan về S_V Convention
IOE INNOVATION Team áp dụng naming convention Subject_Verb (S_V) để tạo ra code dễ đọc và tự mô tả. Pattern này giúp developer hiểu ngay được đối tượng và hành động mà function/variable thực hiện.

### 2.5.2 Function Names - S_V Pattern
**Format**: `subject_verb()` hoặc `subject_verb_object()`

```c
// Good examples - S_V pattern
int led_init(void);                    // LED system initialize
int led_create(config_t *p_config);    // LED instance create  
int led_turn_on(led_id_t id);          // LED turn on
int led_turn_off(led_id_t id);         // LED turn off
int led_toggle(led_id_t id);           // LED toggle state
int led_brightness_set(led_id_t id, uint8_t level);  // LED brightness set
int led_pattern_start(led_id_t id, pattern_t *p_pattern);  // LED pattern start
int led_info_get(led_id_t id, info_t *p_info);      // LED info get

// System functions
int system_time_get_ms(void);          // System time get in milliseconds  
int memory_allocate(size_t size);      // Memory allocate
int buffer_clear(buffer_t *p_buffer); // Buffer clear
```

### 2.5.3 Variable Names - S_V Pattern
**Format**: `subject_state` hoặc `subject_property`

```c
// Good examples
bool led_initialized;        // LED initialization state
uint8_t led_count_active;   // LED active count
uint32_t system_time_ms;    // System time in milliseconds
bool module_ready;          // Module ready state
uint16_t buffer_size_max;   // Buffer maximum size
```

### 2.5.4 Macro Constants - S_V Pattern
**Format**: `SUBJECT_PROPERTY` hoặc `SUBJECT_VALUE`

```c
// Good examples
#define LED_COUNT_MAX              (8U)      // LED maximum count
#define LED_ID_INVALID            (0xFFU)   // LED invalid identifier  
#define LED_BLINK_DEFAULT_MS      (500U)    // LED default blink time
#define RESULT_SUCCESS            (0)       // Result success code
#define RESULT_ERROR              (-1)      // Result error code
#define BUFFER_SIZE_MAX           (256U)    // Buffer maximum size
#define TIMEOUT_DEFAULT_MS        (1000U)   // Default timeout
```

### 2.5.5 Type Definitions - S_V Pattern
**Format**: `subject_type_t` hoặc `subject_t`

```c
// Good examples
typedef uint8_t led_id_t;              // LED identifier type
typedef struct led_config_t;           // LED configuration structure
typedef struct led_info_t;             // LED information structure  
typedef enum led_mode_t;               // LED mode enumeration
typedef void (*event_callback_t)(void); // Event callback function type
```

### 2.5.6 Structure Members - S_V Pattern
```c
typedef struct
{
    led_mode_t    mode;               // Current operating mode
    uint8_t       brightness_level;   // Brightness level (S_V: brightness_level)
    bool          state_on;           // On/off state (S_V: state_on)
    uint32_t      time_last_toggle;   // Last toggle time (S_V: time_last_toggle)
    led_pattern_t pattern_current;    // Current pattern (S_V: pattern_current)
} led_info_t;
```

### 2.5.7 Anti-patterns - Tránh các cách đặt tên sau

```c
// Bad - không rõ subject và verb
init();
create();  
on();
off();

// Bad - verb trước subject  
init_led();
create_led();
turn_led_on();

// Bad - không có verb rõ ràng
led();
led_state();
led_data();

// Bad - abbreviations không cần thiết
led_cfg_t;     // Nên dùng: led_config_t
led_info_st;   // Nên dùng: led_info_t  
led_max_cnt;   // Nên dùng: led_count_max
```

### 2.5.8 Benefits của S_V Convention
1. **Self-documenting**: Code tự mô tả, giảm cần comment
2. **Consistency**: Nhất quán trong toàn bộ codebase
3. **Readability**: Dễ đọc và hiểu ngay ý nghĩa
4. **Maintainability**: Dễ bảo trì và modify
5. **Team collaboration**: Team members dễ hiểu code của nhau


## 3. Naming Conventions

### 3.1 Functions
```c
/* Public API functions: ModuleName_FunctionName */
int led_init(void);
int led_create(const led_config_t *p_config);

/* Private functions: module_name_function_name */
static bool led_validate_config(const led_config_t *p_config);
static void led_hardware_set_state(led_id_t led_id, bool state);
```

### 3.3 Variables
```c
/* Global variables: g_module_name_variable_name */
static led_context_t g_led_context = {0};
static bool g_led_initialized = false;

/* Local variables: snake_case */
int error_count = 0;
uint32_t last_timestamp = 0;

/* Function parameters: p_ prefix for pointers */
int function_example(const config_t *p_config, uint8_t *p_buffer);
```

### 3.4 Constants và Macros
```c
/* Module constants: MODULE_NAME_CONSTANT_NAME */
#define LED_MAX_COUNT          (8U)
#define LED_DEFAULT_TIMEOUT    (1000U)

/* Error codes: MODULE_NAME_ERROR_TYPE */
#define LED_SUCCESS            (0)
#define LED_ERROR              (-1)
#define LED_INVALID_PARAM      (-2)

/* Status/State values: MODULE_NAME_STATE_VALUE */
#define LED_STATE_OFF          (0U)
#define LED_STATE_ON           (1U)
```

### 3.5 Types và Structures
```c
/* Enums: module_name_category_t */
typedef enum
{
    LED_MODE_MANUAL = 0U,
    LED_MODE_BLINK,
    LED_MODE_PATTERN
} led_mode_t;

/* Structures: module_name_category_t */
typedef struct
{
    uint32_t    parameter1;
    uint16_t    parameter2;
    bool        enable_flag;
} led_config_t;

/* Function pointers: module_name_callback_t */
typedef void (*led_callback_t)(void *event_data, void *user_data);
```

## 4. Documentation Standards

### 4.1 Doxygen Function Documentation
```c
/******************************************************************************************************************//**
 * @brief Brief description of the function (one line)
 * @param[in]  param_name   Description of input parameter
 * @param[out] param_name   Description of output parameter
 * @param[in,out] param_name Description of input/output parameter
 * @return Description of return value
 * @retval VALUE1  Description of specific return value
 * @retval VALUE2  Description of another return value
 * 
 * @note Additional notes about usage
 * @warning Important warnings about the function
 * @see Related functions or documentation
 *********************************************************************************************************************/
```

### 4.2 Doxygen Groups
```c
/******************************************************************************************************************//**
 * @addtogroup MODULE_NAME_API
 * @{
 *********************************************************************************************************************/

/* API functions here */

/******************************************************************************************************************//**
 * @} (end addtogroup MODULE_NAME_API)
 *********************************************************************************************************************/
```

## 5. Error Handling Patterns

### 5.1 Standard Return Codes
```c
/* Common return codes (từ common.h) */
#define RESULT_SUCCESS                (0)
#define RESULT_ERROR                  (-1)
#define RESULT_INVALID_PARAM          (-2)
#define RESULT_TIMEOUT                (-3)
#define RESULT_NOT_INITIALIZED        (-4)
#define RESULT_BUSY                   (-5)
#define RESULT_NO_MEMORY              (-6)
```

### 5.2 Parameter Validation Pattern
```c
int function_example(const config_t *p_config, uint8_t *p_output)
{
    /* Parameter validation */
    if (NULL == p_config || NULL == p_output)
    {
        return RESULT_INVALID_PARAM;
    }
    
    /* Check initialization */
    if (!g_module_initialized)
    {
        return RESULT_NOT_INITIALIZED;
    }
    
    /* Validate parameter ranges */
    if (p_config->value > MAX_VALUE || p_config->value < MIN_VALUE)
    {
        return RESULT_INVALID_PARAM;
    }
    
    /* Function implementation */
    
    return RESULT_SUCCESS;
}
```

### 5.3 Error Handling với Cleanup
```c
int complex_function(void)
{
    int ret_val = RESULT_SUCCESS;
    resource_t *p_resource = NULL;
    
    /* Allocate resources */
    p_resource = allocate_resource();
    if (NULL == p_resource)
    {
        ret_val = RESULT_NO_MEMORY;
        goto cleanup;
    }
    
    /* Perform operations */
    ret_val = perform_operation(p_resource);
    if (RESULT_SUCCESS != ret_val)
    {
        goto cleanup;
    }
    
cleanup:
    /* Clean up resources */
    if (p_resource != NULL)
    {
        free_resource(p_resource);
    }
    
    return ret_val;
}
```

## 6. Code Quality Rules

### 6.1 Safety Rules
- **Luôn luôn validate input parameters**
- **Kiểm tra initialization state trước khi sử dụng module**
- **Sử dụng const cho parameters không thay đổi**
- **Khởi tạo variables tại điểm khai báo**
- **Avoid magic numbers - sử dụng named constants**

### 6.2 Readability Rules
```c
/* [OK] GOOD: Clear and descriptive names */
uint32_t button_press_count = 0;
bool led_is_blinking = false;

/* [ERROR] BAD: Unclear abbreviations */
uint32_t btn_cnt = 0;
bool led_blink = false;

/* [OK] GOOD: Proper spacing and alignment */
if (condition1 && condition2)
{
    result = function_call(param1, param2);
}

/* [ERROR] BAD: Poor formatting */
if(condition1&&condition2){
result=function_call(param1,param2);
}
```

### 6.3 Performance Considerations
- **Minimize function call overhead trong ISRs**
- **Sử dụng static cho functions không export**
- **Prefer uint32_t cho counters trên ARM Cortex-M**
- **Align structures để tránh padding**

## 7. Header Guards và Include Management

### 7.1 Header Guard Pattern
```c
#ifndef RESULT_MODULE_NAME_H
#define RESULT_MODULE_NAME_H

/* File content */

#endif /* RESULT_MODULE_NAME_H */
```

### 7.2 Include Order
```c
/* System includes first */
#include <stdint.h>
#include <stdbool.h>
#include <stdio.h>

/* Third-party includes */
#include "third_party_lib.h"

/* Project includes - common first, then specific */
#include "common.h"
#include "specific_module.h"

/* Own header last (in .c files) */
#include "this_module.h"
```

## 8. Debugging và Logging

### 8.1 Debug Macros Pattern
```c
#ifdef DEBUG
#define MODULE_DEBUG_PRINT(fmt, ...) \
    printf("[%s:%d] " fmt "\n", __FUNCTION__, __LINE__, ##__VA_ARGS__)
#else
#define MODULE_DEBUG_PRINT(fmt, ...)
#endif
```

### 8.2 Assertion Usage
```c
#include <assert.h>

void function_example(const config_t *p_config)
{
    /* Runtime parameter check với return code */
    if (NULL == p_config)
    {
        return RESULT_INVALID_PARAM;
    }
    
    /* Development-time check với assert */
    assert(p_config->magic == EXPECTED_MAGIC);
    
    /* Implementation */
}
```

## 9. Memory Management

### 9.1 Static vs Dynamic Allocation
```c
/* [OK] PREFERRED: Static allocation trong embedded */
#define MAX_ITEMS 10
static item_t g_items[MAX_ITEMS];

/* WARNING: USE WITH CARE: Dynamic allocation */
item_t *p_items = malloc(count * sizeof(item_t));
if (NULL != p_items)
{
    /* Use allocated memory */
    free(p_items);
    p_items = NULL; /* Prevent double-free */
}
```

### 9.2 Buffer Management
```c
/* Always validate buffer bounds */
int copy_data(uint8_t *p_dest, size_t dest_size, 
              const uint8_t *p_src, size_t src_size)
{
    if (NULL == p_dest || NULL == p_src)
    {
        return RESULT_INVALID_PARAM;
    }
    
    if (src_size > dest_size)
    {
        return RESULT_ERROR; /* Buffer overflow prevention */
    }
    
    memcpy(p_dest, p_src, src_size);
    return RESULT_SUCCESS;
}
```

## 10. Testing và Validation

### 10.1 Unit Test Integration
```c
/* Test-friendly function design */
#ifdef UNIT_TEST
/* Expose internal functions for testing */
bool led_validate_config(const led_config_t *p_config);
#else
/* Hide internal functions in production */
static bool led_validate_config(const led_config_t *p_config);
#endif
```

### 10.2 Code Coverage Guidelines
- **Public API functions**: 100% code coverage
- **Error handling paths**: Must be tested
- **Parameter validation**: Must be tested
- **Private functions**: Minimum 80% coverage

---

## Tài liệu tham khảo
- [MISRA C Guidelines](https://www.misra.org.uk/)
- [Barr Group Embedded C Coding Standard](https://www.barr.com/embedded-c-coding-standard)
- [Linux Kernel Coding Style](https://www.kernel.org/doc/html/latest/process/coding-style.html)

**IOE INNOVATION Team - Coding Guidelines v1.0.0**  
*Last Updated: 2025-10-23*