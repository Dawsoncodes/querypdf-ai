import os


def get_collections():
    """
    Get a list of collections inside the formatted/ directory
    """

    collections_dir = os.path.join(
        os.path.dirname(__file__), "formatted")
    return os.listdir(collections_dir)
