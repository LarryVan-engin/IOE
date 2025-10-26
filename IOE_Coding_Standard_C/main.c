/*******************************************************************************************************************
 * General Information
 ********************************************************************************************************************
 * Project:       IOE Coding Standards Demo
 * File:          main.c
 * Description:   Main application demonstrating IOE INNOVATION Team coding standards
 * 
 * Author:        Project Leader (IOE INNOVATION Team)
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 * 
 * Hardware:      Generic C (Console Application)
 * Compiler:      GCC 9.4.0 or newer
 * 
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT License
 * 
 * Dependencies:  common.h, led_controller.h
 *                - Standard C library
 *                - IOE LED module
 * 
 * Notes:         This application demonstrates:
 *                - Proper file header formatting
 *                - Module initialization and usage
 *                - Error handling patterns
 *                - Professional code organization
 *                - Only Project Leader has permission to modify this file
 *******************************************************************************************************************/

/**********************************************************************************************************************
 * Includes
 *********************************************************************************************************************/
#include "common.h"
#include "led_controller.h"
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

/**********************************************************************************************************************
 * Macro definitions
 *********************************************************************************************************************/
#define APP_VERSION_MAJOR          (1U)
#define APP_VERSION_MINOR          (0U)
#define APP_VERSION_PATCH          (0U)

#define APP_MAX_LEDS               (3U)
#define APP_DEMO_DURATION_SEC      (10U)
#define APP_PROCESS_INTERVAL_MS    (100U)

/* Demo LED configurations */
#define LED_STATUS_PORT            ((void*)0x1000)  /* Simulated port addresses */
#define LED_STATUS_PIN             (0U)
#define LED_ERROR_PORT             ((void*)0x1000)
#define LED_ERROR_PIN              (1U)
#define LED_ACTIVITY_PORT          ((void*)0x1000)
#define LED_ACTIVITY_PIN           (2U)

/**********************************************************************************************************************
 * Typedef definitions
 *********************************************************************************************************************/

/**
 * @brief Application state enumeration
 */
typedef enum
{
    APP_STATE_INIT = 0U,          /**< Application initializing */
    APP_STATE_RUNNING,            /**< Application running normally */
    APP_STATE_DEMO,               /**< Demo mode active */
    APP_STATE_ERROR,              /**< Application error state */
    APP_STATE_SHUTDOWN            /**< Application shutting down */
} app_state_t;

/**
 * @brief Application context structure
 */
typedef struct
{
    app_state_t     state;         /**< Current application state */
    led_id_t    led_status;    /**< Status LED ID */
    led_id_t    led_error;     /**< Error LED ID */
    led_id_t    led_activity;  /**< Activity LED ID */
    uint32_t        demo_start_time; /**< Demo start timestamp */
    uint32_t        process_count; /**< Process loop counter */
} app_context_t;

/**********************************************************************************************************************
 * Private function prototypes
 *********************************************************************************************************************/
static int app_initialize(void);
static int app_setup_leds(void);
static int app_run_demo(void);
static void app_cleanup(void);
static void app_print_banner(void);
static void app_print_usage(void);
static int app_handle_arguments(int argc, char *argv[]);
static uint32_t app_get_time_seconds(void);
static void app_delay_ms(uint32_t delay_ms);

/**********************************************************************************************************************
 * Private global variables
 *********************************************************************************************************************/
static app_context_t g_app_context = {0};
static bool g_verbose_mode = false;
static bool g_test_mode = false;

/**********************************************************************************************************************
 * Global variables
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @addtogroup Application_Main
 * @{
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Function Implementation
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @brief Main application entry point
 * @param[in] argc  Number of command line arguments
 * @param[in] argv  Array of command line argument strings
 * @return Exit status code
 * @retval EXIT_SUCCESS  Application completed successfully
 * @retval EXIT_FAILURE  Application encountered error
 *********************************************************************************************************************/
int main(int argc, char *argv[])
{
    int ret_val = EXIT_SUCCESS;
    
    /* Print application banner */
    app_print_banner();
    
    /* Handle command line arguments */
    if (app_handle_arguments(argc, argv) != RESULT_SUCCESS)
    {
        app_print_usage();
        return EXIT_FAILURE;
    }
    
    /* Initialize application */
    if (app_initialize() != RESULT_SUCCESS)
    {
        fprintf(stderr, "ERROR: Application initialization failed!\n");
        return EXIT_FAILURE;
    }
    
    printf("SUCCESS: Application initialized successfully\n");
    
    /* Run demonstration */
    if (app_run_demo() != RESULT_SUCCESS)
    {
        fprintf(stderr, "ERROR: Demo execution failed!\n");
        ret_val = EXIT_FAILURE;
    }
    else
    {
        printf("SUCCESS: Demo completed successfully\n");
    }
    
    /* Cleanup and exit */
    app_cleanup();
    printf("INFO: Application finished. Goodbye!\n");
    
    return ret_val;
}

/******************************************************************************************************************//**
 * @} (end addtogroup Application_Main)
 *********************************************************************************************************************/

/**********************************************************************************************************************
 * Private Functions
 *********************************************************************************************************************/

/******************************************************************************************************************//**
 * @brief Initialize application components
 * @return Status code
 *********************************************************************************************************************/
static int app_initialize(void)
{
    int ret_val;
    
    printf("INFO: Initializing IOE Coding Standards Demo...\n");
    
    /* Reset application context */
    memset(&g_app_context, 0, sizeof(app_context_t));
    g_app_context.state = APP_STATE_INIT;
    
    /* Initialize LED module */
    ret_val = led_init();
    if (RESULT_SUCCESS != ret_val)
    {
        fprintf(stderr, "Error: LED module initialization failed (code: %d)\n", ret_val);
        return ret_val;
    }
    
    if (g_verbose_mode)
    {
        printf("  INFO: LED module initialized\n");
    }
    
    /* Setup LEDs */
    ret_val = app_setup_leds();
    if (RESULT_SUCCESS != ret_val)
    {
        fprintf(stderr, "Error: LED setup failed (code: %d)\n", ret_val);
        return ret_val;
    }
    
    if (g_verbose_mode)
    {
        printf("  INFO: LEDs configured\n");
    }
    
    /* Set application state to running */
    g_app_context.state = APP_STATE_RUNNING;
    
    return RESULT_SUCCESS;
}

/******************************************************************************************************************//**
 * @brief Setup LED configurations
 * @return Status code
 *********************************************************************************************************************/
static int app_setup_leds(void)
{
    int ret_val;
    led_config_t led_config;
    
    /* Configure Status LED (Active High) */
    led_config.gpio_port = LED_STATUS_PORT;
    led_config.gpio_pin = LED_STATUS_PIN;
    led_config.polarity = LED_POLARITY_ACTIVE_HIGH;
    led_config.enabled = true;
    
    ret_val = led_create(&led_config, &g_app_context.led_status);
    if (RESULT_SUCCESS != ret_val)
    {
        fprintf(stderr, "Error: Status LED creation failed (code: %d)\n", ret_val);
        return ret_val;
    }
    
    /* Configure Error LED (Active High) */
    led_config.gpio_port = LED_ERROR_PORT;
    led_config.gpio_pin = LED_ERROR_PIN;
    led_config.polarity = LED_POLARITY_ACTIVE_HIGH;
    led_config.enabled = true;
    
    ret_val = led_create(&led_config, &g_app_context.led_error);
    if (RESULT_SUCCESS != ret_val)
    {
        fprintf(stderr, "Error: Error LED creation failed (code: %d)\n", ret_val);
        return ret_val;
    }
    
    /* Configure Activity LED (Active High) */
    led_config.gpio_port = LED_ACTIVITY_PORT;
    led_config.gpio_pin = LED_ACTIVITY_PIN;
    led_config.polarity = LED_POLARITY_ACTIVE_HIGH;
    led_config.enabled = true;
    
    ret_val = led_create(&led_config, &g_app_context.led_activity);
    if (RESULT_SUCCESS != ret_val)
    {
        fprintf(stderr, "Error: Activity LED creation failed (code: %d)\n", ret_val);
        return ret_val;
    }
    
    /* Turn on status LED to indicate system ready */
    led_turn_on(g_app_context.led_status);
    
    return RESULT_SUCCESS;
}

/******************************************************************************************************************//**
 * @brief Run LED demonstration sequence
 * @return Status code
 *********************************************************************************************************************/
static int app_run_demo(void)
{
    led_pattern_t blink_pattern;
    uint32_t demo_start_time;
    uint32_t current_time;
    
    printf("INFO: Starting LED demonstration...\n");
    
    if (g_test_mode)
    {
        printf("INFO: Test mode: Running quick validation\n");
        
        /* Quick test sequence */
        printf("  INFO: Testing basic LED operations...\n");
        led_turn_on(g_app_context.led_activity);
        app_delay_ms(200);
        led_turn_off(g_app_context.led_activity);
        app_delay_ms(200);
        led_toggle(g_app_context.led_activity);
        app_delay_ms(200);
        led_toggle(g_app_context.led_activity);
        
        printf("SUCCESS: Basic LED test completed\n");
        return RESULT_SUCCESS;
    }
    
    /* Set demo state */
    g_app_context.state = APP_STATE_DEMO;
    demo_start_time = app_get_time_seconds();
    
    /* Demo sequence 1: Individual LED control */
    printf("  PHASE: Phase 1: Individual LED Control (3 seconds)\n");
    
    for (int i = 0; i < 6; i++)
    {
        led_turn_on(g_app_context.led_activity);
        app_delay_ms(250);
        led_turn_off(g_app_context.led_activity);
        app_delay_ms(250);
        
        /* Process LED module */
        led_process();
        g_app_context.process_count++;
    }
    
    /* Demo sequence 2: Blinking patterns */
    printf("  PHASE: Phase 2: Blinking Patterns (4 seconds)\n");
    
    /* Fast blink on activity LED */
    blink_pattern.on_time_ms = 200;
    blink_pattern.off_time_ms = 200;
    blink_pattern.repeat_count = 10;
    
    led_pattern_start(g_app_context.led_activity, &blink_pattern);
    
    /* Process for 4 seconds */
    for (int i = 0; i < 40; i++)  /* 40 * 100ms = 4 seconds */
    {
        app_delay_ms(APP_PROCESS_INTERVAL_MS);
        led_process();
        g_app_context.process_count++;
    }
    
    /* Demo sequence 3: Multiple LED coordination */
    printf("  PHASE: Phase 3: Multiple LED Coordination (3 seconds)\n");
    
    /* Alternating pattern between status and error LEDs */
    for (int i = 0; i < 6; i++)
    {
        if (i % 2 == 0)
        {
            led_turn_on(g_app_context.led_status);
            led_turn_off(g_app_context.led_error);
        }
        else
        {
            led_turn_off(g_app_context.led_status);
            led_turn_on(g_app_context.led_error);
        }
        
        app_delay_ms(500);
        led_process();
        g_app_context.process_count++;
    }
    
    /* Final state: All LEDs off except status */
    led_all_turn_off();
    led_turn_on(g_app_context.led_status);
    
    current_time = app_get_time_seconds();
    
    printf("INFO: Demo completed in %u seconds (processed %u cycles)\n", 
           current_time - demo_start_time, g_app_context.process_count);
    
    return RESULT_SUCCESS;
}

/******************************************************************************************************************//**
 * @brief Cleanup application resources
 *********************************************************************************************************************/
static void app_cleanup(void)
{
    printf("INFO: Cleaning up application resources...\n");
    
    /* Set shutdown state */
    g_app_context.state = APP_STATE_SHUTDOWN;
    
    /* Turn off all LEDs */
    led_all_turn_off();
    
    /* Deinitialize LED module */
    led_deinit();
    
    if (g_verbose_mode)
    {
        printf("  INFO: LED module deinitialized\n");
        printf("  🔢 Total process cycles: %u\n", g_app_context.process_count);
    }
}

/******************************************************************************************************************//**
 * @brief Print application banner
 *********************************************************************************************************************/
static void app_print_banner(void)
{
    printf("\n");
    printf("═══════════════════════════════════════════════════════════════\n");
    printf("   IOE INNOVATION Team - Coding Standards Demonstration\n");
    printf("   Version %u.%u.%u\n", APP_VERSION_MAJOR, APP_VERSION_MINOR, APP_VERSION_PATCH);
    printf("═══════════════════════════════════════════════════════════════\n");
    printf("\n");
    printf("INFO: Purpose: Demonstrate professional C coding standards\n");
    printf("INFO: Features: LED control, modular design, error handling\n");
    printf("STANDARDS: File headers, documentation, code organization\n");
    printf("\n");
}

/******************************************************************************************************************//**
 * @brief Print usage information
 *********************************************************************************************************************/
static void app_print_usage(void)
{
    printf("Usage: %s [options]\n", "ioe_coding_standard");
    printf("\n");
    printf("Options:\n");
    printf("  -v, --verbose    Enable verbose output\n");
    printf("  -t, --test       Run in test mode (quick validation)\n");
    printf("  -h, --help       Show this help message\n");
    printf("\n");
    printf("Examples:\n");
    printf("  %s              # Run normal demo\n", "ioe_coding_standard");
    printf("  %s -v           # Run with verbose output\n", "ioe_coding_standard");
    printf("  %s --test       # Run quick test\n", "ioe_coding_standard");
    printf("\n");
}

/******************************************************************************************************************//**
 * @brief Handle command line arguments
 * @param[in] argc  Number of arguments
 * @param[in] argv  Argument array
 * @return Status code
 *********************************************************************************************************************/
static int app_handle_arguments(int argc, char *argv[])
{
    for (int i = 1; i < argc; i++)
    {
        if (strcmp(argv[i], "-v") == 0 || strcmp(argv[i], "--verbose") == 0)
        {
            g_verbose_mode = true;
            printf("INFO: Verbose mode enabled\n");
        }
        else if (strcmp(argv[i], "-t") == 0 || strcmp(argv[i], "--test") == 0)
        {
            g_test_mode = true;
            printf("INFO: Test mode enabled\n");
        }
        else if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0)
        {
            return RESULT_ERROR; /* Will trigger usage display */
        }
        else
        {
            fprintf(stderr, "Error: Unknown argument '%s'\n", argv[i]);
            return RESULT_ERROR;
        }
    }
    
    return RESULT_SUCCESS;
}

/******************************************************************************************************************//**
 * @brief Get current time in seconds (simulation)
 * @return Current time in seconds
 *********************************************************************************************************************/
static uint32_t app_get_time_seconds(void)
{
    /* Simple simulation - in real application use system time */
    static uint32_t sim_time = 0;
    return sim_time++;
}

/******************************************************************************************************************//**
 * @brief Delay execution for specified milliseconds
 * @param[in] delay_ms  Delay duration in milliseconds
 *********************************************************************************************************************/
static void app_delay_ms(uint32_t delay_ms)
{
    /* Use system sleep function */
    usleep(delay_ms * 1000); /* Convert ms to microseconds */
}

/*******************************************************************************************************************
 * End of File
 *******************************************************************************************************************/
