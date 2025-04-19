{ inputs, ... }:

{
  perSystem =
    {
      config,
      lib,
      system,
      ...
    }:
    {
      devShells =
        let
          pkgs = import inputs.nixpkgs { inherit system; };
          stdenv = pkgs.stdenv;
          scripts = config.packages.python-scripts;
        in
        lib.pipe (config.packages) [
          (lib.concatMapAttrs (
            name: package: {
              ${name} = pkgs.mkShell {
                name = "${name}";
                inputsFrom = [ package ];
                shellHook = ''
                  echo "Entering ${name} devShell"
                '';
                ROCM_PATH = "${pkgs.rocmPackages.clr}";
                HIP_DEVICE_LIB_PATH = "${pkgs.rocmPackages.rocm-device-libs}/amdgcn/bitcode";
                HSA_OVERRIDE_GFX_VERSION = "10.3.0";
              };
              "${name}-extra" =
                if (name == "python-scripts") then
                  null
                else
                  pkgs.mkShell {
                    name = "${name}-extra";
                    inputsFrom = [
                      package
                      scripts
                    ];
                    # Extra packages that *may* be used by some scripts
                    packages = [
                        pkgs.python3Packages.tiktoken
                        pkgs.rocmPackages.clr
                        pkgs.amdgpu_top
                    ];
                    shellHook = ''
                      echo "Entering ${name} devShell"
                      addToSearchPath "LD_LIBRARY_PATH" "${lib.getLib stdenv.cc.cc}/lib"
                    '';
                  };
            }
          ))
          (lib.filterAttrs (name: value: value != null))
        ];
    };
}
