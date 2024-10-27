-- Enable RLS
alter table memories enable row level security;

-- Create memories table
create table memories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  recipient text not null,
  message text not null,
  date date not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
create policy "Users can view their own memories"
  on memories for select
  using (auth.uid() = user_id);

create policy "Users can insert their own memories"
  on memories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own memories"
  on memories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own memories"
  on memories for delete
  using (auth.uid() = user_id);