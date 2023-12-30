import os
import pandas as pd


df = pd.read_csv(os.path.join(os.path.dirname(__file__), "text_segments.csv"))

df['text'] = df['text'].astype(str)


def join_texts(group):
    """
    Joins the text of a group of rows
    """

    return "\n\n".join(filter(None, group))


def format_document():
    """
    Formatts the unstructured text into a structured format in different pages and it will be saved
    in the formatted/ directory.
    """

    result = df.groupby(['doc_name', 'pagenum']).agg({
        'text': join_texts
    }).reset_index()

    for _, row in result.iterrows():
        doc_name = row['doc_name']
        pagenum = row['pagenum']
        text = row['text']

        # Create directory for doc_name if it doesn't exist
        dir_path = os.path.join(os.path.dirname(
            __file__), "formatted", doc_name)

        if not os.path.exists(dir_path):
            os.makedirs(dir_path)

        # Write the file
        with open(f"{dir_path}/{pagenum}.txt", "w", encoding="utf8") as f:
            f.write(f"Page {pagenum}\n\n{text}")

    print("Documents formatted successfully!")


if __name__ == "__main__":
    format_document()
