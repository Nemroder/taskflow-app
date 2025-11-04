-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text not null default '#6366f1',
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in-progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  tags text[] default array[]::text[],
  project_id uuid not null references public.projects(id) on delete cascade,
  assignee_id uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete cascade,
  position integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.comments enable row level security;

-- Profiles policies
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects policies
create policy "Users can view all projects"
  on public.projects for select
  using (true);

create policy "Users can create projects"
  on public.projects for insert
  with check (auth.uid() = owner_id);

create policy "Project owners can update their projects"
  on public.projects for update
  using (auth.uid() = owner_id);

create policy "Project owners can delete their projects"
  on public.projects for delete
  using (auth.uid() = owner_id);

-- Tasks policies
create policy "Users can view tasks in projects"
  on public.tasks for select
  using (true);

create policy "Users can create tasks"
  on public.tasks for insert
  with check (auth.uid() = created_by);

create policy "Users can update tasks"
  on public.tasks for update
  using (auth.uid() = created_by or auth.uid() = assignee_id);

create policy "Task creators can delete tasks"
  on public.tasks for delete
  using (auth.uid() = created_by);

-- Comments policies
create policy "Users can view comments in projects"
  on public.comments for select
  using (true);

create policy "Users can create comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Comment authors can delete their comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists projects_owner_id_idx on public.projects(owner_id);
create index if not exists tasks_project_id_idx on public.tasks(project_id);
create index if not exists tasks_assignee_id_idx on public.tasks(assignee_id);
create index if not exists comments_project_id_idx on public.comments(project_id);
create index if not exists comments_user_id_idx on public.comments(user_id);
