import os

def check_file_content():
    try:
        with open("src/pages/Banking.tsx", "r") as f:
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

        print("src/pages/Banking.tsx verification passed.")
        return True
    except Exception as e:
        print(f"Error reading file: {e}")
        return False

if __name__ == "__main__":
    if check_file_content():
        print("All checks passed.")
    else:
        print("Verification FAILED.")
        exit(1)
