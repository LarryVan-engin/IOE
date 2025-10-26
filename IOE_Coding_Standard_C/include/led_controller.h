/*******************************************************************************************************************
 * General Information
 ********************************************************************************************************************
 * Project:       IOE Coding Standards Demo
 * File:          led_controller.h
 * Description:   LED control module interface for IOE INNOVATION Team projects
 * 
 * Authors:       Author_1: led_init, led_create, led_remove - Basic LED management functions
 *                Author_2: led_turn_on, led_turn_off, led_toggle - Basic LED control operations
 *                Author_3: led_pattern_start, led_pattern_stop - Pattern control functionality
 *                Author_4: led_process, led_info_get - Processing and information functions
 *                
 * Functions:     led_init: Initialize the LED module system
 *                led_create: Create and configure a new LED instance
 *                led_turn_on: Turn specified LED on
 *                led_turn_off: Turn specified LED off
 *                led_toggle: Toggle LED state
 *                led_pattern_start: Start blinking pattern on LED
 *                led_process: Process LED operations (call periodically)
 * 
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 * 
 * Hardware:      Generic GPIO (adaptable to STM32, Arduino, etc.)
 * Compiler:      GCC 9.4.0 or newer
 * 
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT License
 * 
 * Notes:         Provides abstraction layer for LED control operations
 *                - Multiple LED support
 *                - Blinking patterns
 *                - Power management integration
 *******************************************************************************************************************/

#ifndef LED_CONTROLLER_H
#define LED_CONTROLLER_H

#ifdef __cplusplus
extern "C" {
#endif

/**********************************************************************************************************************
 * Includes
 *********************************************************************************************************************/
#include "common.h"

/**********************************************************************************************************************
 * Macro definitions
 *********************************************************************************************************************/
/* Module version information */
#define LED_VERSION_MAJOR          (1U)
#define LED_VERSION_MINOR          (0U) 
#define LED_VERSION_PATCH          (0U)

/* LED configuration constants */
#define LED_COUNT_MAX              (8U)
#define LED_ID_INVALID             (0xFFU)
#define LED_BLINK_DEFAULT_MS       (500U)
#define LED_BLINK_COUNT_MAX        (255U)

/* LED states */
#define LED_STATE_OFF              (0U)
#define LED_STATE_ON               (1U)

/**********************************************************************************************************************
 * Typedef definitions
 *********************************************************************************************************************/

/**
 * @brief LED identifier type
 */
typedef uint8_t led_id_t;

/**
 * @brief LED operating modes following Subject_Verb convention
 */
typedef enum
{
    LED_MODE_MANUAL = 0U,             /**< Manual control (on/off) */
    LED_MODE_BLINK,                   /**< Blinking mode */
    LED_MODE_PATTERN,                 /**< Pattern mode */
    LED_MODE_PWM                      /**< PWM brightness control */
} led_mode_t;

/**
 * @brief LED polarity configuration
 */
typedef enum
{
    LED_POLARITY_ACTIVE_HIGH = 0U,    /**< LED on when GPIO high */
    LED_POLARITY_ACTIVE_LOW           /**< LED on when GPIO low */
} led_polarity_t;

/**
 * @brief LED configuration structure
 */
typedef struct
{
    void            *gpio_port;       /**< GPIO port (platform specific) */
    uint16_t         gpio_pin;        /**< GPIO pin number */
    led_polarity_t   polarity;        /**< LED polarity */
    bool             enabled;         /**< LED enable flag */
} led_config_t;

/**
 * @brief LED blink pattern structure
 */
typedef struct
{
    uint16_t on_time_ms;              /**< On duration in milliseconds */
    uint16_t off_time_ms;             /**< Off duration in milliseconds */
    uint8_t  repeat_count;            /**< Number of repetitions (0 = infinite) */
} led_pattern_t;

/**
 * @brief LED runtime information
 */
typedef struct
{
    led_mode_t    mode;               /**< Current operating mode */
    uint8_t       brightness;         /**< Brightness level (0-100) */
    bool          is_on;              /**< Current on/off state */
    uint32_t      last_toggle_ms;     /**< Last toggle timestamp */
    led_pattern_t pattern;            /**< Current pattern */
    uint8_t       pattern_step;       /**< Current pattern step */
} led_info_t;

/**********************************************************************************************************************
 * Exported global functions (API)
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @addtogroup LED_API
 * @{
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @brief Initialize the LED module system
 * 
 * Input Requirements:
 *   - No parameters required
 *   - System must have sufficient memory for LED contexts
 *   - GPIO hardware must be available
 * 
 * Output Specifications:
 *   - Return: RESULT_SUCCESS (0) on successful initialization
 *   - Return: RESULT_ERROR (-1) if initialization fails
 *   - Module state: Transitions to initialized state
 *   - All LED slots: Reset to unallocated state
 *   - Hardware: GPIO simulation initialized
 * 
 * Side Effects:
 *   - Initializes global LED module context
 *   - Resets all LED control structures
 *   - Sets up GPIO simulation system
 *   - Marks module as initialized
 * 
 * @return Status code
 * @retval RESULT_SUCCESS  Module initialized successfully
 * @retval RESULT_ERROR    Initialization failed
 * 
 * @note This function must be called before any other LED operations
 * @author Author_1 - Responsible for module initialization and setup
 *********************************************************************************************************************/
int led_init(void);

/******************************************************************************************************************//**
 * @brief Deinitialize the LED module system
 * @return Status code
 * @retval RESULT_SUCCESS  Module deinitialized successfully
 * 
 * @note All LEDs will be turned off during deinitialization
 *********************************************************************************************************************/
int led_deinit(void);

/******************************************************************************************************************//**
 * @brief Create and configure a new LED
 * 
 * Input Requirements:
 *   - p_config: Valid pointer to LED configuration structure, must not be NULL
 *   - p_config->gpio_port: Valid GPIO port pointer (platform specific)
 *   - p_config->gpio_pin: Valid GPIO pin number (0-15 for most platforms)
 *   - p_config->polarity: IOE_LED_POLARITY_ACTIVE_HIGH or IOE_LED_POLARITY_ACTIVE_LOW
 *   - p_config->enabled: Boolean enable flag
 *   - p_led_id: Valid pointer to store LED ID, must not be NULL
 *   - Module must be initialized (ioe_led_init called)
 * 
 * Output Specifications:
 *   - Return: IOE_SUCCESS (0) on successful LED creation
 *   - Return: IOE_INVALID_PARAM (-2) if parameters are invalid
 *   - Return: IOE_NO_MEMORY (-6) if no LED slots available
 *   - Return: IOE_NOT_INITIALIZED (-4) if module not initialized
 *   - *p_led_id: Contains assigned LED identifier (0 to IOE_LED_MAX_COUNT-1)
 *   - LED state: Created and configured, initially OFF
 *   - Hardware: GPIO configured for LED control
 * 
 * Side Effects:
 *   - Allocates one LED control slot
 *   - Increments active LED count
 *   - Configures GPIO hardware for LED
 *   - Sets LED to OFF state initially
 * 
 * @param[in] p_config    Pointer to LED configuration
 * @param[out] p_led_id   Pointer to store assigned LED ID
 * @return Status code
 * @retval RESULT_SUCCESS        LED created successfully
 * @retval RESULT_INVALID_PARAM  Invalid parameters
 * @retval RESULT_NO_MEMORY      No available LED slots
 * 
 * @note LED ID is automatically assigned and returned via p_led_id
 * @author Author_1 - Responsible for LED creation and configuration
 *********************************************************************************************************************/
int led_create(const led_config_t *p_config, led_id_t *p_led_id);

/******************************************************************************************************************//**
 * @brief Remove a LED from the system
 * @param[in] led_id  LED identifier
 * @return Status code
 * @retval RESULT_SUCCESS        LED removed successfully
 * @retval RESULT_INVALID_PARAM  Invalid LED ID
 * 
 * @note LED will be turned off before removal
 *********************************************************************************************************************/
int led_remove(led_id_t led_id);

/******************************************************************************************************************//**
 * @brief Turn LED on
 * @param[in] led_id  LED identifier
 * @return Status code
 * @retval RESULT_SUCCESS        LED turned on successfully
 * @retval RESULT_INVALID_PARAM  Invalid LED ID
 *********************************************************************************************************************/
int led_turn_on(led_id_t led_id);

/******************************************************************************************************************//**
 * @brief Turn LED off
 * @param[in] led_id  LED identifier
 * @return Status code
 * @retval RESULT_SUCCESS        LED turned off successfully
 * @retval RESULT_INVALID_PARAM  Invalid LED ID
 *********************************************************************************************************************/
int led_turn_off(led_id_t led_id);

/******************************************************************************************************************//**
 * @brief Toggle LED state
 * @param[in] led_id  LED identifier
 * @return Status code
 * @retval RESULT_SUCCESS        LED toggled successfully
 * @retval RESULT_INVALID_PARAM  Invalid LED ID
 *********************************************************************************************************************/
int led_toggle(led_id_t led_id);

/******************************************************************************************************************//**
 * @brief Set LED brightness level (if PWM supported)
 * @param[in] led_id     LED identifier
 * @param[in] brightness Brightness level (0-100)
 * @return Status code
 * @retval RESULT_SUCCESS        Brightness set successfully
 * @retval RESULT_INVALID_PARAM  Invalid parameters
 *********************************************************************************************************************/
int led_brightness_set(led_id_t led_id, uint8_t brightness);

/******************************************************************************************************************//**
 * @brief Start LED pattern blinking with specified configuration
 * @param[in] led_id    LED identifier
 * @param[in] p_pattern Pointer to blink pattern
 * @return Status code
 * @retval RESULT_SUCCESS        Blinking started successfully
 * @retval RESULT_INVALID_PARAM  Invalid parameters
 * 
 * @note Call led_process() periodically for blinking to work
 *********************************************************************************************************************/
int led_pattern_start(led_id_t led_id, const led_pattern_t *p_pattern);

/******************************************************************************************************************//**
 * @brief Stop LED pattern and return to manual mode
 * @param[in] led_id  LED identifier
 * @return Status code
 * @retval RESULT_SUCCESS        Blinking stopped successfully
 * @retval RESULT_INVALID_PARAM  Invalid LED ID
 *********************************************************************************************************************/
int led_pattern_stop(led_id_t led_id);

/******************************************************************************************************************//**
 * @brief Get LED runtime information and status
 * @param[in] led_id   LED identifier
 * @param[out] p_info  Pointer to store LED information
 * @return Status code
 * @retval RESULT_SUCCESS        Information retrieved successfully
 * @retval RESULT_INVALID_PARAM  Invalid parameters
 *********************************************************************************************************************/
int led_info_get(led_id_t led_id, led_info_t *p_info);

/******************************************************************************************************************//**
 * @brief Process LED operations and handle timing (call periodically)
 * @return Status code
 * @retval RESULT_SUCCESS  Processing completed successfully
 * 
 * @note This function handles blinking patterns and should be called
 *       periodically from main loop or timer interrupt
 *********************************************************************************************************************/
int led_process(void);

/******************************************************************************************************************//**
 * @brief Turn all LEDs off immediately
 * @return Status code
 * @retval RESULT_SUCCESS  All LEDs turned off successfully
 * 
 * @note Useful for emergency shutdown or power saving
 *********************************************************************************************************************/
int led_all_turn_off(void);

/******************************************************************************************************************//**
 * @} (end addtogroup LED_API)
 *********************************************************************************************************************/

#ifdef __cplusplus
}
#endif

#endif /* LED_CONTROLLER_H */

/*******************************************************************************************************************
 * End of File
 *******************************************************************************************************************/
