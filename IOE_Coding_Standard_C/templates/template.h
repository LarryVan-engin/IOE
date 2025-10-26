/*******************************************************************************************************************
 * General Information
 ********************************************************************************************************************
 * Project:       [PROJECT_NAME]
 * File:          [FILE_NAME].h
 * Description:   [BRIEF_DESCRIPTION]
 * 
 * Authors:       [AUTHOR_1]: [FUNCTION_LIST_1] - [FUNCTION_DESCRIPTIONS_1]
 *                [AUTHOR_2]: [FUNCTION_LIST_2] - [FUNCTION_DESCRIPTIONS_2]
 *                [AUTHOR_3]: [FUNCTION_LIST_3] - [FUNCTION_DESCRIPTIONS_3]
 *                
 * Functions:     [FUNCTION_1]: [DESCRIPTION_1]
 *                [FUNCTION_2]: [DESCRIPTION_2]
 *                [FUNCTION_3]: [DESCRIPTION_3]
 * 
 * Created:       [CREATION_DATE]
 * Last Update:   [LAST_UPDATE_DATE]
 * Version:       [VERSION]
 * 
 * Hardware:      [TARGET_HARDWARE] (e.g., STM32F4xx, Generic C)
 * Compiler:      [COMPILER_VERSION] (e.g., GCC 9.4.0, ARM-GCC)
 * 
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       [LICENSE_TYPE] (e.g., MIT, GPL, Proprietary)
 * 
 * Notes:         [ADDITIONAL_NOTES]
 *                - [NOTE_1]
 *                - [NOTE_2]
 *******************************************************************************************************************/

#ifndef [HEADER_GUARD]
#define [HEADER_GUARD]

#ifdef __cplusplus
extern "C" {
#endif

/**********************************************************************************************************************
 * Includes
 *********************************************************************************************************************/
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>
/* Add project-specific includes here */

/**********************************************************************************************************************
 * Macro definitions
 *********************************************************************************************************************/
/* Module version information - Subject_Verb convention */
#define VERSION_MAJOR                  (1U)
#define VERSION_MINOR                  (0U)
#define VERSION_PATCH                  (0U)

/* Module specific constants - Subject_Verb convention */
#define VALUE_MAX                      (100U)
#define VALUE_MIN                      (0U)
#define TIMEOUT_DEFAULT_MS             (1000U)

/* Standard result codes - Subject_Verb convention */
#define RESULT_SUCCESS                 (0)
#define RESULT_ERROR                   (-1)
#define RESULT_INVALID_PARAM           (-2)
#define RESULT_TIMEOUT                 (-3)

/**********************************************************************************************************************
 * Typedef definitions
 *********************************************************************************************************************/

/**
 * @brief Module status enumeration - Subject_Verb convention
 */
typedef enum
{
    MODULE_STATUS_IDLE = 0U,           /**< Module is idle */
    MODULE_STATUS_BUSY,                /**< Module is busy */
    MODULE_STATUS_ERROR,               /**< Module has error */
    MODULE_STATUS_READY                /**< Module is ready */
} module_status_t;

/**
 * @brief Module configuration structure - Subject_Verb convention
 */
typedef struct
{
    uint32_t    parameter_1;           /**< Parameter 1 description (S_V: parameter_1) */
    uint16_t    parameter_2;           /**< Parameter 2 description (S_V: parameter_2) */
    uint8_t     parameter_3;           /**< Parameter 3 description (S_V: parameter_3) */
    bool        flag_enabled;          /**< Enable/disable flag (S_V: flag_enabled) */
} module_config_t;

/**
 * @brief Event callback function type - Subject_Verb convention
 * @param[in] event_data    Pointer to event data
 * @param[in] user_data     User-defined data pointer
 */
typedef void (*event_callback_t)(void *event_data, void *user_data);

/**********************************************************************************************************************
 * Exported global variables
 *********************************************************************************************************************/
/* Declare external variables here if needed */
extern const [module_name]_config_t g_[module_name]_default_config;

/**********************************************************************************************************************
 * Exported global functions (API)
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @addtogroup [MODULE_NAME]_API
 * @{
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @brief Initialize the [MODULE_NAME] module
 * 
 * Input Requirements:
 *   - p_config: Valid pointer to configuration structure
 *   - p_config->parameter1: Must be within range [MIN_VALUE, MAX_VALUE]
 *   - p_config->parameter2: Must be valid 16-bit value
 *   - p_config->enable_flag: Boolean enable/disable flag
 * 
 * Output Specifications:
 *   - Return code: IOE_SUCCESS (0) on successful initialization
 *   - Return code: IOE_INVALID_PARAM (-2) if parameters are invalid
 *   - Return code: IOE_ERROR (-1) if initialization fails
 *   - Module state: Changed to initialized and ready for use
 *   - Global variables: g_module_initialized set to true
 * 
 * Side Effects:
 *   - Modifies global module context structure
 *   - May enable hardware clocks or peripherals
 *   - Registers interrupt handlers if applicable
 * 
 * @param[in] p_config    Pointer to configuration structure
 * @return Status code
 * @retval [MODULE_NAME]_SUCCESS        Initialization successful
 * @retval [MODULE_NAME]_INVALID_PARAM  Invalid parameter
 * @retval [MODULE_NAME]_ERROR          Initialization failed
 * 
 * @note This function must be called before using any other module functions
 * @warning Configuration pointer must not be NULL
 * @author [AUTHOR_NAME] - Responsible for parameter validation and hardware setup
 *********************************************************************************************************************/
int [module_name]_init(const [module_name]_config_t *p_config);

/******************************************************************************************************************//**
 * @brief Deinitialize the [MODULE_NAME] module
 * @return Status code
 * @retval [MODULE_NAME]_SUCCESS  Deinitialization successful
 * @retval [MODULE_NAME]_ERROR    Deinitialization failed
 *********************************************************************************************************************/
int [module_name]_deinit(void);

/******************************************************************************************************************//**
 * @brief Get current module status
 * @return Current status of the module
 * 
 * @note This function is thread-safe
 *********************************************************************************************************************/
[module_name]_status_t [module_name]_get_status(void);

/******************************************************************************************************************//**
 * @brief Set module configuration
 * @param[in] p_config    Pointer to new configuration
 * @return Status code
 * @retval [MODULE_NAME]_SUCCESS        Configuration set successfully
 * @retval [MODULE_NAME]_INVALID_PARAM  Invalid parameter
 * @retval [MODULE_NAME]_ERROR          Configuration failed
 * 
 * @warning Module must be in idle state before calling this function
 *********************************************************************************************************************/
int [module_name]_set_config(const [module_name]_config_t *p_config);

/******************************************************************************************************************//**
 * @brief Get current module configuration
 * @param[out] p_config   Pointer to store current configuration
 * @return Status code
 * @retval [MODULE_NAME]_SUCCESS        Configuration retrieved successfully
 * @retval [MODULE_NAME]_INVALID_PARAM  Invalid parameter
 *********************************************************************************************************************/
int [module_name]_get_config([module_name]_config_t *p_config);

/******************************************************************************************************************//**
 * @brief Register callback function for module events
 * @param[in] callback    Callback function pointer
 * @param[in] user_data   User-defined data pointer
 * @return Status code
 * @retval [MODULE_NAME]_SUCCESS        Callback registered successfully
 * @retval [MODULE_NAME]_INVALID_PARAM  Invalid callback pointer
 *********************************************************************************************************************/
int [module_name]_register_callback([module_name]_callback_t callback, void *user_data);

/******************************************************************************************************************//**
 * @brief Process module operations (call periodically)
 * @return Status code
 * @retval [MODULE_NAME]_SUCCESS  Processing completed successfully
 * @retval [MODULE_NAME]_ERROR    Processing error occurred
 * 
 * @note This function should be called periodically in main loop or timer ISR
 *********************************************************************************************************************/
int [module_name]_process(void);

/******************************************************************************************************************//**
 * @} (end addtogroup [MODULE_NAME]_API)
 *********************************************************************************************************************/

#ifdef __cplusplus
}
#endif

#endif /* [HEADER_GUARD] */

/*******************************************************************************************************************
 * End of File
 *******************************************************************************************************************/