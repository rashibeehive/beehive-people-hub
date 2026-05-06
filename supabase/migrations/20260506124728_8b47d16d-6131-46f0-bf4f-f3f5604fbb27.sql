
-- ============ ROLES ENUM & TABLE ============
CREATE TYPE public.app_role AS ENUM ('employee', 'manager', 'department_head', 'hr_admin');

-- ============ EMPLOYEES ============
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  work_email TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  job_title TEXT NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('IC','MG','EX')),
  level_code TEXT NOT NULL,
  manager_email TEXT,
  location TEXT NOT NULL CHECK (location IN ('UAE','KSA','Oman')),
  employment_type TEXT NOT NULL DEFAULT 'Full time',
  start_date DATE NOT NULL,
  last_promotion_date DATE,
  salary_aed INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ CAREER LEVELS ============
CREATE TABLE public.career_levels (
  level_code TEXT NOT NULL PRIMARY KEY,
  track TEXT NOT NULL CHECK (track IN ('IC','MG','EX')),
  l_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  salary_band_min_aed INTEGER,
  salary_band_max_aed INTEGER,
  sort_order INTEGER NOT NULL
);

-- ============ COMPETENCIES ============
CREATE TABLE public.competencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  group_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

-- ============ PROMOTION HISTORY ============
CREATE TABLE public.promotion_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  effective_date DATE NOT NULL,
  previous_level TEXT,
  new_level TEXT NOT NULL,
  previous_title TEXT,
  new_title TEXT NOT NULL,
  salary_at_promotion_aed INTEGER,
  direct_reports_count INTEGER,
  scope_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ REVIEW CYCLES ============
CREATE TABLE public.review_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  quarter INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','closed')),
  self_review_due DATE,
  manager_review_due DATE,
  calibration_due DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ REVIEWS ============
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID NOT NULL REFERENCES public.review_cycles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES public.employees(id),
  status TEXT NOT NULL DEFAULT 'pending_self' CHECK (status IN ('pending_self','pending_manager','pending_calibration','published')),
  overall_rating TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cycle_id, employee_id)
);

-- ============ REVIEW RESPONSES ============
CREATE TABLE public.review_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  respondent_type TEXT NOT NULL CHECK (respondent_type IN ('self','manager','peer')),
  competency_id UUID REFERENCES public.competencies(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  note TEXT,
  question_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ OKR PILLARS ============
CREATE TABLE public.okr_pillars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  role public.app_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- ============ SECURITY DEFINER ROLE CHECK ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ EMPLOYEE FOR CURRENT USER ============
CREATE OR REPLACE FUNCTION public.current_employee_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT employee_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1
$$;

-- ============ HR-ONLY SALARY ACCESSOR ============
CREATE OR REPLACE FUNCTION public.get_employee_salary(_employee_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN public.has_role(auth.uid(), 'hr_admin')
    THEN (SELECT salary_aed FROM public.employees WHERE id = _employee_id)
    ELSE NULL END
$$;

-- ============ PUBLIC EMPLOYEES VIEW (no salary) ============
CREATE VIEW public.employees_public AS
  SELECT id, employee_id, full_name, work_email, department, job_title,
         track, level_code, manager_email, location, employment_type,
         start_date, last_promotion_date, created_at, updated_at
  FROM public.employees;

-- ============ ENABLE RLS ============
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============ POLICIES ============
-- employees: any authed can SELECT (salary protected via separate RPC). HR admins can write.
CREATE POLICY "Authed view employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'hr_admin'));
CREATE POLICY "HR update employees" ON public.employees FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'hr_admin'));
CREATE POLICY "HR delete employees" ON public.employees FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'hr_admin'));

CREATE POLICY "Authed view career_levels" ON public.career_levels FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR write career_levels" ON public.career_levels FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'hr_admin')) WITH CHECK (public.has_role(auth.uid(), 'hr_admin'));

CREATE POLICY "Authed view competencies" ON public.competencies FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR write competencies" ON public.competencies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'hr_admin')) WITH CHECK (public.has_role(auth.uid(), 'hr_admin'));

CREATE POLICY "Authed view okr_pillars" ON public.okr_pillars FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR write okr_pillars" ON public.okr_pillars FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'hr_admin')) WITH CHECK (public.has_role(auth.uid(), 'hr_admin'));

CREATE POLICY "Authed view review_cycles" ON public.review_cycles FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR write review_cycles" ON public.review_cycles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'hr_admin')) WITH CHECK (public.has_role(auth.uid(), 'hr_admin'));

-- promotion_history: own or HR
CREATE POLICY "View own promotions or HR" ON public.promotion_history FOR SELECT TO authenticated
  USING (employee_id = public.current_employee_id() OR public.has_role(auth.uid(), 'hr_admin'));
CREATE POLICY "HR write promotions" ON public.promotion_history FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'hr_admin')) WITH CHECK (public.has_role(auth.uid(), 'hr_admin'));

-- reviews: own or HR
CREATE POLICY "View own reviews or HR" ON public.reviews FOR SELECT TO authenticated
  USING (employee_id = public.current_employee_id() OR manager_id = public.current_employee_id() OR public.has_role(auth.uid(), 'hr_admin'));
CREATE POLICY "HR write reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'hr_admin')) WITH CHECK (public.has_role(auth.uid(), 'hr_admin'));

-- review_responses: own (self) or HR
CREATE POLICY "View own responses or HR" ON public.review_responses FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.reviews r WHERE r.id = review_id AND (r.employee_id = public.current_employee_id() OR r.manager_id = public.current_employee_id()))
    OR public.has_role(auth.uid(), 'hr_admin')
  );
CREATE POLICY "Insert own self responses" ON public.review_responses FOR INSERT TO authenticated
  WITH CHECK (
    respondent_type = 'self'
    AND EXISTS (SELECT 1 FROM public.reviews r WHERE r.id = review_id AND r.employee_id = public.current_employee_id() AND r.status = 'pending_self')
  );
CREATE POLICY "Update own self responses" ON public.review_responses FOR UPDATE TO authenticated
  USING (
    respondent_type = 'self'
    AND EXISTS (SELECT 1 FROM public.reviews r WHERE r.id = review_id AND r.employee_id = public.current_employee_id() AND r.status = 'pending_self')
  );

-- user_roles: user can view own; HR can manage all
CREATE POLICY "View own role" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'hr_admin'));
CREATE POLICY "HR manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'hr_admin')) WITH CHECK (public.has_role(auth.uid(), 'hr_admin'));

-- ============ AUTO-LINK NEW USERS TO EMPLOYEE BY EMAIL ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  emp_id UUID;
  emp_role public.app_role := 'employee';
BEGIN
  SELECT id INTO emp_id FROM public.employees WHERE work_email = NEW.email;
  -- Default role based on department/title heuristic for HR
  IF emp_id IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.employees WHERE id = emp_id AND department = 'HR') THEN
      emp_role := 'hr_admin';
    END IF;
    INSERT INTO public.user_roles (user_id, employee_id, role)
    VALUES (NEW.id, emp_id, emp_role)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SEED CAREER LEVELS ============
INSERT INTO public.career_levels (level_code, track, l_number, title, sort_order) VALUES
  ('IC1','IC',1,'Intern/Junior Analyst',1),
  ('IC2','IC',2,'Analyst',2),
  ('IC3','IC',3,'Senior Analyst',3),
  ('IC4','IC',4,'Lead',4),
  ('IC5','IC',5,'Staff',5),
  ('IC6','IC',6,'Principal',6),
  ('MG1','MG',4,'Manager',7),
  ('MG2','MG',5,'Senior Manager',8),
  ('MG3','MG',6,'Head of/Associate Director',9),
  ('MG4','MG',7,'Director/Associate VP',10),
  ('EX1','EX',8,'VP/Senior Director',11),
  ('EX2','EX',9,'CTO/COO/CFO',12),
  ('EX3','EX',10,'CEO',13);

-- ============ SEED COMPETENCIES ============
INSERT INTO public.competencies (name, group_name, sort_order) VALUES
  ('Proactive Decision Making','Decision & Action',1),
  ('Problem Solving','Decision & Action',2),
  ('Initiative','Decision & Action',3),
  ('Bias for Action','Decision & Action',4),
  ('Ownership and Accountability','Ownership',5),
  ('Responsibility','Ownership',6),
  ('Ethical Conduct','Ownership',7),
  ('Self-Reflection and Awareness','Ownership',8),
  ('Open Communication','Communication',9),
  ('Transparency & Clarity','Communication',10),
  ('Active Listening','Communication',11),
  ('Feedback Exchange','Communication',12),
  ('High Performance Orientation','Performance',13),
  ('Excellence','Performance',14),
  ('Goal-Setting','Performance',15),
  ('Resilience','Performance',16);

-- ============ SEED OKR PILLARS ============
INSERT INTO public.okr_pillars (name, sort_order) VALUES
  ('Revenue & loan book',1),
  ('Operational excellence',2),
  ('Employee productivity',3),
  ('Governance & culture',4),
  ('AI adoption',5);

-- ============ SEED EMPLOYEES ============
INSERT INTO public.employees (employee_id, full_name, work_email, department, job_title, track, level_code, manager_email, location, employment_type, start_date) VALUES
  ('BH-001','Ahmed Al Rashidi','ahmed.rashidi@beehive.ae','Executive','CEO','EX','EX3',NULL,'UAE','Full time','2018-01-15'),
  ('BH-002','Nadia Farouk','nadia.farouk@beehive.ae','Executive','COO','EX','EX2','ahmed.rashidi@beehive.ae','UAE','Full time','2018-03-01'),
  ('BH-005','Omar Siddiqui','omar.siddiqui@beehive.ae','HR','VP People','EX','EX1','nadia.farouk@beehive.ae','UAE','Full time','2020-01-20'),
  ('BH-006','Sara Al Mansoori','sara.mansoori@beehive.ae','Credit','Head of Credit','MG','MG3','nadia.farouk@beehive.ae','UAE','Full time','2019-09-01'),
  ('BH-014','Aisha Noor','aisha.noor@beehive.ae','HR','Senior Manager People Ops','MG','MG2','omar.siddiqui@beehive.ae','UAE','Full time','2021-06-01'),
  ('BH-021','Tariq Mahmoud','tariq.mahmoud@beehive.ae','Credit','Lead Credit Analyst','IC','IC4','sara.mansoori@beehive.ae','UAE','Full time','2021-02-01'),
  ('BH-029','Rashi Agarwal','rashi.agarwal@beehive.ae','HR','Senior People Ops Analyst','IC','IC3','aisha.noor@beehive.ae','UAE','Full time','2024-03-10'),
  ('BH-030','Kevin Obi','kevin.obi@beehive.ae','Technology','Senior Software Engineer','IC','IC3','ben.carter@beehive.ae','UAE','Full time','2022-11-01'),
  ('BH-036','Majid Al Khaili','majid.khaili@beehive.ae','Credit','Analyst','IC','IC2','tariq.mahmoud@beehive.ae','UAE','Full time','2023-09-01'),
  ('BH-045','Shamma Al Mazrouei','shamma.mazrouei@beehive.ae','Technology','Junior Software Engineer','IC','IC1',NULL,'UAE','Full time','2025-01-06');
