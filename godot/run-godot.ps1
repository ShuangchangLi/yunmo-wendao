$GodotExe = "C:\godot\godot.exe"
$ProjectPath = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path $GodotExe)) {
  Write-Error "Godot executable not found at $GodotExe"
  exit 1
}

& $GodotExe --path $ProjectPath
