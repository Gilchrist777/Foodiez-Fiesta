import zipfile
import os

zip_path = 'public/foodiez-fiesta-project.zip'
exclude_dirs = {'node_modules', 'dist', 'dev-dist', '.git', '__pycache__'}
exclude_files = {'foodiez-fiesta-project.zip', 'foodiez-fiesta-pos.tar.gz'}

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file in exclude_files:
                continue
            filepath = os.path.join(root, file)
            arcname = os.path.relpath(filepath, '.')
            zipf.write(filepath, arcname)

size_kb = os.path.getsize(zip_path) / 1024
print(f"Project zip successfully created: {size_kb:.1f} KB")
