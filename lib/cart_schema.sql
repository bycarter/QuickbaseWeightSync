--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: control_records; Type: TABLE; Schema: public; Owner: based
--

CREATE TABLE public.control_records (
    id integer NOT NULL,
    tray_n integer NOT NULL,
    cell_n integer NOT NULL,
    tare numeric(5,3),
    gross numeric(5,3),
    c_gross numeric(5,3),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    prod_order integer NOT NULL,
    net numeric(5,3),
    p_error numeric(6,2),
    in_spec boolean
);


ALTER TABLE public.control_records OWNER TO based;

--
-- Name: control_records_id_seq; Type: SEQUENCE; Schema: public; Owner: based
--

CREATE SEQUENCE public.control_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.control_records_id_seq OWNER TO based;

--
-- Name: control_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: based
--

ALTER SEQUENCE public.control_records_id_seq OWNED BY public.control_records.id;


--
-- Name: control_records id; Type: DEFAULT; Schema: public; Owner: based
--

ALTER TABLE ONLY public.control_records ALTER COLUMN id SET DEFAULT nextval('public.control_records_id_seq'::regclass);


--
-- Name: control_records control_records_pkey; Type: CONSTRAINT; Schema: public; Owner: based
--

ALTER TABLE ONLY public.control_records
    ADD CONSTRAINT control_records_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

