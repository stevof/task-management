-- CREATE DATABASE tasks;

--///////////////////////////////////////////
-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id SERIAL,
    name character varying(1000) NOT NULL,
    created_date timestamp without time zone NOT NULL DEFAULT now(),
    email character varying(200),
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to tasks;

--///////////////////////////////////////////
-- Table: public.tasks

-- DROP TABLE IF EXISTS public.tasks;

CREATE TABLE IF NOT EXISTS public.tasks
(
    id SERIAL,
    user_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description character varying(2000),
    priority integer,
    is_complete boolean NOT NULL DEFAULT false,
    due_date timestamp with time zone,
    completed_date timestamp with time zone,
    created_date timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_users_fk FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tasks
    OWNER to tasks;


--///////////////////////////////////////////
-- Table: public.reminders

-- DROP TABLE IF EXISTS public.reminders;

CREATE TABLE IF NOT EXISTS public.reminders
(
    id SERIAL,
    task_id integer NOT NULL,
    reminder_date timestamp with time zone,
    created_date timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT reminders_pkey PRIMARY KEY (id),
    CONSTRAINT reminders_tasks_fk FOREIGN KEY (task_id)
        REFERENCES public.tasks (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reminders
    OWNER to tasks;