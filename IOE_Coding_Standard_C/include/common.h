/*******************************************************************************************************************
 * General Information
 ********************************************************************************************************************
 * Project:       IOE Coding Standards Demo
 * File:          common.h
 * Description:   Common definitions and macros for IOE INNOVATION Team projects
 * 
 * Authors:       Author_1: Error codes and status definitions - Standard return values
                Author_2: Common data types and structures - Basic type definitions
                Author_3: Utility macros and bit operations - Helper macros
                Author_4: Version and callback functions - Support functions
                
 * Functions:     version_get: Retrieve library version information
                error_to_string: Convert error codes to readable strings
 * 
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 * 
 * Hardware:      Generic C (Portable)
 * Compiler:      GCC 9.4.0 or newer
 * 
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT License
 * 
 * Notes:         This file contains common definitions used across all IOE modules
 *                - Standard return codes
 *                - Common data types
 *                - Utility macros
 *******************************************************************************************************************/

#ifndef COMMON_H
#define COMMON_H

#ifdef __cplusplus
extern "C" {
#endif

/**********************************************************************************************************************
 * Includes
 *********************************************************************************************************************/
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

/**********************************************************************************************************************
 * Macro definitions
 *********************************************************************************************************************/

/* Library version constants */
#define VERSION_MAJOR              (1U)
#define VERSION_MINOR              (0U)
#define VERSION_PATCH              (0U)

/* Standard return codes */
#define RESULT_SUCCESS             (0)
#define RESULT_ERROR               (-1)
#define RESULT_INVALID_PARAM       (-2)
#define RESULT_TIMEOUT             (-3)
#define RESULT_NOT_INITIALIZED     (-4)
#define RESULT_BUSY                (-5)
#define RESULT_NO_MEMORY           (-6)

/* System constants */
#define BUFFER_NAME_MAX_LENGTH     (64U)
#define BUFFER_PATH_MAX_LENGTH     (256U)
#define TIMEOUT_DEFAULT_MS         (1000U)

/* Array and math utility macros */
#define ARRAY_SIZE_GET(arr)        (sizeof(arr) / sizeof((arr)[0]))
#define VALUE_MIN_GET(a, b)        (((a) < (b)) ? (a) : (b))
#define VALUE_MAX_GET(a, b)        (((a) > (b)) ? (a) : (b))
#define VALUE_CLAMP(val, min, max) VALUE_MAX_GET((min), VALUE_MIN_GET((val), (max)))

/* Bit manipulation macros */
#define BIT_SET(reg, bit)          ((reg) |= (1U << (bit)))
#define BIT_CLEAR(reg, bit)        ((reg) &= ~(1U << (bit)))
#define BIT_TOGGLE(reg, bit)       ((reg) ^= (1U << (bit)))
#define BIT_CHECK(reg, bit)        (((reg) >> (bit)) & 1U)

/* Memory alignment macros */
#define MEMORY_ALIGN_UP(addr, align)   (((addr) + (align) - 1) & ~((align) - 1))
#define MEMORY_ALIGN_DOWN(addr, align) ((addr) & ~((align) - 1))

/**********************************************************************************************************************
 * Typedef definitions
 *********************************************************************************************************************/

/**
 * @brief Module status enumeration following Subject_Verb convention
 */
typedef enum
{
    MODULE_STATUS_UNINITIALIZED = 0U, /**< Module not initialized */
    MODULE_STATUS_IDLE,               /**< Module is idle */
    MODULE_STATUS_BUSY,               /**< Module is busy */
    MODULE_STATUS_READY,              /**< Module is ready */
    MODULE_STATUS_ERROR,              /**< Module has error */
    MODULE_STATUS_TIMEOUT             /**< Module operation timed out */
} module_status_t;

/**
 * @brief Event callback function type
 * @param[in] event_data    Pointer to event-specific data
 * @param[in] user_data     User-defined data pointer
 */
typedef void (*event_callback_t)(void *event_data, void *user_data);

/**
 * @brief Version information structure
 */
typedef struct
{
    uint8_t major;                    /**< Major version number */
    uint8_t minor;                    /**< Minor version number */
    uint8_t patch;                    /**< Patch version number */
    char    build_date[16];           /**< Build date string */
} version_info_t;

/**********************************************************************************************************************
 * Exported global functions (API)
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @addtogroup Common_API
 * @{
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @brief Get library version information
 * @param[out] p_version  Pointer to store version information
 * @return Status code
 * @retval RESULT_SUCCESS        Version retrieved successfully
 * @retval RESULT_INVALID_PARAM  Invalid parameter
 *********************************************************************************************************************/
int version_get(version_info_t *p_version);

/******************************************************************************************************************//**
 * @brief Convert error code to human-readable string
 * @param[in] error_code  Error code to convert
 * @return Pointer to error string
 * 
 * @note Returned string is statically allocated and should not be freed
 *********************************************************************************************************************/
const char *error_to_string(int error_code);

/******************************************************************************************************************//**
 * @} (end addtogroup Common_API)
 *********************************************************************************************************************/

#ifdef __cplusplus
}
#endif

#endif /* COMMON_H */

/*******************************************************************************************************************
 * End of File
 *******************************************************************************************************************/
