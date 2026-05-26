from pydantic import BaseModel

class TraceRequest(BaseModel):
    code: str            # The entire block of algorithm code (e.g., bubble sort definition)
    function_call: str   # The execution string that fires it off (e.g., "bubble_sort([3, 1, 2])")