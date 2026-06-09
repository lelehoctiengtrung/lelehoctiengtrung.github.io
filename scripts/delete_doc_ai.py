import os
import argparse
import subprocess

REPO_DIR = "/media/vpsg16gb/Workspace/lelehoctiengtrung/Website_lelehoctiengtrung"

def run_git(args):
    try:
        subprocess.run(["git"] + args, cwd=REPO_DIR, check=True)
    except Exception as e:
        print(f"Git execution warning: {e}")

def main():
    parser = argparse.ArgumentParser(description="Delete document or book from website repo")
    parser.add_argument("--id", required=True, help="ID/SKU of the document/book")
    parser.add_argument("--type", required=True, choices=["doc", "book"], help="Type: 'doc' or 'book'")
    args = parser.parse_args()
    
    item_id = args.id.strip().upper()
    item_type = args.type
    
    print(f"🗑️ Deleting files for {item_type} with ID: {item_id}...")
    
    # 1. Sync repository
    run_git(["pull", "origin", "main"])
    
    deleted_files = []
    
    # Define paths
    if item_type == "doc":
        md_path = os.path.join(REPO_DIR, "POSTS", "docs", f"{item_id}.md")
        pdf_path = os.path.join(REPO_DIR, "POSTS", "docs", f"{item_id}.pdf")
    else:
        md_path = os.path.join(REPO_DIR, "POSTS", "reviews", f"{item_id}.md")
        pdf_path = os.path.join(REPO_DIR, "POSTS", "reviews", f"{item_id}.pdf")
        
    cover_path = os.path.join(REPO_DIR, "POSTS", "images", f"{item_id}_cover.png")
    mockup_path = os.path.join(REPO_DIR, "POSTS", "images", f"{item_id}_mockup.png")
    
    # Helper to delete file and its metadata
    def remove_file(filepath):
        if os.path.exists(filepath):
            os.remove(filepath)
            deleted_files.append(filepath)
            print(f"Removed: {filepath}")
            # Try to remove macOS metadata file
            meta_name = f"._{os.path.basename(filepath)}"
            meta_path = os.path.join(os.path.dirname(filepath), meta_name)
            if os.path.exists(meta_path):
                os.remove(meta_path)
                deleted_files.append(meta_path)
                print(f"Removed metadata: {meta_path}")

    # Remove the files
    remove_file(md_path)
    remove_file(pdf_path)
    remove_file(cover_path)
    remove_file(mockup_path)
    
    if not deleted_files:
        print("⚠️ No matching files found to delete.")
    
    # 3. Commit and push
    run_git(["add", "-A"])
    commit_msg = f"Delete {item_type} {item_id}"
    
    # Check if there are changes to commit
    status = subprocess.run(["git", "status", "--porcelain"], cwd=REPO_DIR, capture_output=True, text=True)
    if status.stdout.strip():
        try:
            subprocess.run(["git", "commit", "-m", commit_msg], cwd=REPO_DIR, check=True)
            subprocess.run(["git", "push", "origin", "main"], cwd=REPO_DIR, check=True)
            print("🚀 Successfully pushed deletions to GitHub Pages.")
        except Exception as e:
            print(f"❌ Error committing/pushing changes: {e}")
    else:
        print("ℹ️ No changes to commit (repository is clean).")

if __name__ == "__main__":
    main()
