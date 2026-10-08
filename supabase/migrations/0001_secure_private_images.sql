-- Serviro: make restaurant images private.
-- Apply this migration in Supabase SQL Editor after reviewing it.
-- Public menu image delivery will be migrated to signed URLs in the application layer.

update storage.buckets
set public = false,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'restaurant-images';

-- Remove the old broad policies. They allowed any public client to read every image.
drop policy if exists "Give public access to images" on storage.objects;
drop policy if exists "Allow upload for owner" on storage.objects;

-- Files are stored under: restaurants/{restaurant_id}/...
-- Authenticated restaurant users may manage only their own restaurant's files.
create policy "Restaurant owners can read own image objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'restaurant-images'
  and (storage.foldername(name))[1] = 'restaurants'
  and exists (
    select 1
    from public.restaurants r
    where r.id::text = (storage.foldername(name))[2]
      and r.user_id = (select auth.uid())
  )
);

create policy "Restaurant owners can upload image objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'restaurant-images'
  and (storage.foldername(name))[1] = 'restaurants'
  and exists (
    select 1
    from public.restaurants r
    where r.id::text = (storage.foldername(name))[2]
      and r.user_id = (select auth.uid())
  )
);

create policy "Restaurant owners can update image objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'restaurant-images'
  and (storage.foldername(name))[1] = 'restaurants'
  and exists (
    select 1
    from public.restaurants r
    where r.id::text = (storage.foldername(name))[2]
      and r.user_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'restaurant-images'
  and (storage.foldername(name))[1] = 'restaurants'
  and exists (
    select 1
    from public.restaurants r
    where r.id::text = (storage.foldername(name))[2]
      and r.user_id = (select auth.uid())
  )
);

create policy "Restaurant owners can delete image objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'restaurant-images'
  and (storage.foldername(name))[1] = 'restaurants'
  and exists (
    select 1
    from public.restaurants r
    where r.id::text = (storage.foldername(name))[2]
      and r.user_id = (select auth.uid())
  )
);
