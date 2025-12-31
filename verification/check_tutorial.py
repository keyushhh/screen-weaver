import os

def check_file_content():
    try:
        with open("src/pages/MyCards.tsx", "r") as f:
            content = f.read()
            if "tutorial-tap.png" in content and "tutorial-long-press.png" in content:
                print("Assets imported successfully.")
            else:
                print("Assets import MISSING.")
                return False

            if "dotpe_stack_tutorial_seen" in content:
                print("LocalStorage logic present.")
            else:
                print("LocalStorage logic MISSING.")
                return False

            if "tutorialStep > 0" in content:
                print("Tutorial rendering logic present.")
            else:
                print("Tutorial rendering logic MISSING.")
                return False

        print("src/pages/MyCards.tsx verification passed.")
        return True
    except Exception as e:
        print(f"Error reading file: {e}")
        return False

def check_assets():
    assets = ["src/assets/tutorial-tap.png", "src/assets/tutorial-long-press.png"]
    all_exist = True
    for asset in assets:
        if os.path.exists(asset):
            print(f"Asset found: {asset}")
        else:
            print(f"Asset MISSING: {asset}")
            all_exist = False
    return all_exist

if __name__ == "__main__":
    if check_file_content() and check_assets():
        print("All checks passed.")
    else:
        print("Verification FAILED.")
        exit(1)
