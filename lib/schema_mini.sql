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

CREATE SEQUENCE public.control_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY public.control_records ALTER COLUMN id SET DEFAULT nextval('public.control_records_id_seq'::regclass);

ALTER TABLE ONLY public.control_records
    ADD CONSTRAINT control_records_pkey PRIMARY KEY (id);
