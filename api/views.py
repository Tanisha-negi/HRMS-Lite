from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer
from django.utils.timezone import now
from django.db import transaction
from datetime import date

@api_view(['GET', 'POST'])
def employee_list(request):
    if request.method == 'GET':
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_employee(request, pk):
    try:
        employee = Employee.objects.get(pk=pk)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def mark_attendance(request):
    if request.method == 'GET':
        attendance = Attendance.objects.all()
        return Response([{
            "id": a.id, 
            "employee": a.employee.name, 
            "status": a.status, 
            "date": a.date
        } for a in attendance])

    if request.method == 'POST':
        print("Received Data:", request.data)

        employee_id = request.data.get('employee_id') or request.data.get('employee') or request.data.get('emp_id')
        status_val = request.data.get('status')
        
        date_val = request.data.get('date') or date.today()

        if not employee_id or not status_val:
            return Response({"error": "Missing employee ID or status"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            employee = Employee.objects.get(id=employee_id)
            Attendance.objects.create(
                employee=employee,
                status=status_val,
                date=date_val
            )
            return Response({"message": "Attendance marked successfully!"}, status=status.HTTP_201_CREATED)
        
        except Employee.DoesNotExist:
            return Response({"error": f"Employee with ID {employee_id} not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def employee_attendance(request, emp_id):
    """Returns all historical attendance for a single employee"""
    try:
        employee = Employee.objects.get(id=emp_id)
        records = employee.attendances.all().order_by('-date')
        serializer = AttendanceSerializer(records, many=True)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)