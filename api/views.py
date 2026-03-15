from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer
from django.utils.timezone import now
from django.db import transaction

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
        date_str = request.query_params.get('date', now().date())
        records = Attendance.objects.filter(date=date_str)
        serializer = AttendanceSerializer(records, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        records = request.data.get('records', [])
        
        try:
            with transaction.atomic():
                for item in records:
                    Attendance.objects.update_or_create(
                        employee_id=item.get('employee'),
                        date=item.get('date'),
                        defaults={'status': item.get('status')}
                    )
            return Response({"message": f"Updated {len(records)} records"}, status=201)
        
        except Exception as e:
            print(f"BATCH ERROR: {str(e)}")
            return Response({"error": str(e)}, status=500)

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