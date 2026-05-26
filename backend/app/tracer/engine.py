import sys
import copy

class CodeTracer:
    def __init__(self):
        self.steps = []
        self.step_counter = 0

    def trace_callback(self, frame, event, arg):
        # We only want to trace lines inside the user's executed function
        if frame.f_code.co_name == "<module>":
            return self.trace_callback

        # 1. Capture the current line number being executed
        line_no = frame.f_lineno
        
        # 2. Capture a deep snapshot of the variables at this exact split-second
        local_vars = copy.deepcopy(frame.f_locals)

        # 3. Capture the current function call stack frame name
        func_name = frame.f_code.co_name

        # Increment our timeline pointer step
        self.step_counter += 1

        # 4. Pack it cleanly into a structured dictionary step
        step_snapshot = {
            "step": self.step_counter,
            "line": line_no,
            "function": func_name,
            "event": event,
            "variables": local_vars
        }

        self.steps.append(step_snapshot)
        return self.trace_callback

    def run_code(self, code_string, function_call_string):
        """
        Takes raw string code and executes it under our tracing camera lens.
        """
        self.steps = []
        self.step_counter = 0

        # Create an isolated scope dictionary for execution
        global_scope = {}
        local_scope = {}

        # Compile and execute the user's defined function definitions
        exec(code_string, global_scope, local_scope)
        
        # Bring the newly defined functions into the global scope context
        global_scope.update(local_scope)

        # Turn on our line-by-line tracing camera
        sys.settrace(self.trace_callback)
        
        try:
            # Execute the specific function call trigger line
            exec(function_call_string, global_scope, local_scope)
        finally:
            # CRITICAL: Always turn the tracer OFF when finished so the server runs normally
            sys.settrace(None)

        return self.steps


# This block must be completely flush with the left margin, outside the class!
if __name__ == "__main__":
    # Create an instance of our new tracer engine
    tracer = CodeTracer()

    # Define a simple target algorithm to test (Counting a total sum)
    sample_code = """
def count_up(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total
"""
    # The exact command execution execution trigger
    sample_call = "count_up(3)"

    print("--- Executing Trace ---")
    trace_history = tracer.run_code(sample_code, sample_call)
    
    # Print out each captured JSON step nicely
    import json
    print(json.dumps(trace_history, indent=2))