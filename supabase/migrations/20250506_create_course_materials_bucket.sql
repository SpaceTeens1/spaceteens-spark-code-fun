
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'Course Materials', true);

-- Set up a policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-materials');

-- Set up a policy to allow public access to view files
CREATE POLICY "Allow public access to view files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-materials');

-- Set up a policy to allow authenticated users to update their own files
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'course-materials' AND auth.uid() = owner);

-- Set up a policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'course-materials' AND auth.uid() = owner);
