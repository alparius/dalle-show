import datetime
import psycopg2

import config

INSERT_PROMPT_CMD = """
    INSERT INTO prompts (timestamp, prompt, seed, nsfw_text, nsfw_image)
    VALUES (%(timestamp)s, %(prompt)s, %(seed)s, %(nsfw_text)s, %(nsfw_image)s) 
    RETURNING prompt, timestamp;
"""


def create_connection():
    return psycopg2.connect(
        database=config.DB_NAME, user=config.DB_USER, password=config.DB_PASSWORD
    )


def save_prompt(conn, prompt, seed, nsfw_text, nsfw_image):
    try:
        with conn:
            with conn.cursor() as cur:
                params = {
                    "timestamp": datetime.datetime.now().isoformat(),
                    "prompt": prompt,
                    "seed": seed,
                    "nsfw_text": nsfw_text,
                    "nsfw_image": nsfw_image,
                }
                cur.execute(INSERT_PROMPT_CMD, params)
    except Exception as e:
        print(f"Failed to save prompt to db: {e}")


def create_tables():
    """Create tables in the database"""
    conn = psycopg2.connect(
        database=config.DB_NAME, user=config.DB_USER, password=config.DB_PASSWORD
    )
    try:
        with conn:  # wrap the insides in one transaction
            with conn.cursor() as cur:
                create_table_cmd = """
                CREATE TABLE IF NOT EXISTS prompts (
                    timestamp TIMESTAMP,
                    prompt TEXT,
                    seed INTEGER,
                    nsfw_text bool,
                    nsfw_image bool 
                    );
                """
                cur.execute(create_table_cmd)

        with conn:
            with conn.cursor() as cur:
                params = {
                    "timestamp": datetime.datetime.now().isoformat(),
                    "prompt": "test_prompt",
                    "seed": 42,
                    "nsfw_text": True,
                    "nsfw_image": None,
                }
                cur.execute(INSERT_PROMPT_CMD, params)
                print(f"Inserted row with prompt and ts: {cur.fetchone()}")

        with conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * from prompts;")
                print(f"Query one row from table: {cur.fetchone()}")
    finally:
        conn.close()
