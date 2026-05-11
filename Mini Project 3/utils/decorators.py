# utils/decorators.py - @log_call and @retry decorators
import functools
import time
import logging

logger = logging.getLogger(__name__)


# logs entry and exit of any decorated function
def log_call(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(f"calling {func.__name__}")
        result = func(*args, **kwargs)
        logger.info(f"{func.__name__} completed")
        return result
    return wrapper


# retries the decorated function up to 'times' attempts on any exception
def retry(times=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    logger.warning(
                        f"{func.__name__} attempt {attempt}/{times} failed: {e}"
                    )
                    if attempt == times:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator
